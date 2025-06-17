# Architecture
*Tommy’s Wedding Manager – Firebase-centric cloud design*

---

## 1. High-Level Overview

The platform is deliberately **front-light / back-heavy**:

| Layer | Responsibility | Technology |
|-------|----------------|------------|
| **SSR Frontend (self-hosted)** | • Server-side render guest & admin pages<br>• Route protection & locale selection<br>• Proxy lightweight API calls to Firebase when required | **SvelteKit** (Node adapter) running in a Docker container |
| **Managed Backend (Firebase)** | • Authentication & session management<br>• Persistent data (invites, RSVPs, notes)<br>• File storage (QR codes, exports)<br>• Scheduled jobs & webhooks<br>• Transactional + bulk e-mails | **Firebase** suite:<br>• Auth<br>• Cloud Firestore<br>• Cloud Storage<br>• Cloud Functions<br>• Cloud Scheduler<br>• (optional) SendGrid Extension |

The self-hosted node container gives us full UI/UX control and easy deployment on any VPS, while all stateful concerns live in Google Cloud—eliminating the need to run and patch our own DB, object store, queue, or SMTP server.

---

## 2. Core Firebase Components

| Firebase Product | What We Store / Handle | Notes & Rules |
|------------------|------------------------|---------------|
| **Auth** | • Admin users (email + password)<br>• Invitees (anonymous / custom-token sign-in) | *Custom Claims* flag roles:<br>`role=admin` or `inviteId=<code>` |
| **Cloud Firestore** | **Collections**<br>`invites/{code}` → family-level doc<br>`invites/{code}/guests/{id}` → per-person RSVP<br>`news/{id}` → announcements | Rules reference Auth claims:<br>`read/write if request.auth.token.inviteId == <code>` |
| **Cloud Storage** | `qr/{code}.png`, `exports/*.csv`, registry photos | Signed URLs for public registry images; private ACL for exports |
| **Cloud Functions** | • **HTTP** – `/tokenFromInvite/:code` returns a custom JWT to sign-in invitees<br>• **Background** – Firestore triggers (email on RSVP), Storage triggers (generate thumbnails)<br>• **Scheduled** – Deadline enforcement job sets `locked=true` on expired invites | Functions written in TypeScript; deployed with `firebase deploy --only functions` |
| **Cloud Scheduler** | Cron expression (`every 1 min`) to hit the deadline-lock function | Keeps UI logic simple; backend is source-of-truth |
| **SendGrid Extension** | Bulk reminders & transactional emails (multi-language templates) | Swap with Mailgun / SES by changing one Function |

---

## 3. End-to-End Data Flow Scenarios

### 3.1 Guest RSVPs
1. **Invite link** `https://mywedding.app/invite/ABCDE?lang=it` opens SvelteKit page.  
2. Frontend calls Cloud Function **`tokenFromInvite`** → receives a *custom Firebase token* tied to invite `ABCDE`.  
3. Browser **signs in silently**; Auth passes `inviteId` in JWT claims.  
4. Firestore SDK **subscribes** to `invites/ABCDE/**` docs for real-time UI.  
5. Guest submits form → Firestore `update` writes `status=accepted`, `dietary=...`.  
6. Firestore **onWrite Trigger** sends confirmation email & notifies admin dashboard via FCM/WebSocket.

### 3.2 RSVP Deadline
1. Cloud Scheduler (cron) invokes **`lockExpiredInvites`** Function.  
2. Function queries `invites` where `deadline < now && locked == false`, sets `locked=true`.  
3. Frontend checks `locked` flag; if true, forms are disabled and a banner shows “Please contact us to make changes”.

### 3.3 Bulk Email Reminder
1. Admin dashboard issues HTTPS request to **`queueBulkReminder`** Function.  
2. Function enqueues messages into SendGrid Extension (or your own SES sender) *batched by preferred language*.  
3. Guests receive localized reminder including magic invite link (`/invite/<code>`).

---

## 4. Security & Access Control

| Concern | Mechanism |
|---------|-----------|
| **Role separation** | Custom Claims (`admin`, `inviteId`) enforced in Firestore & Storage rules. |
| **Data isolation** | Invitee can only read/write docs with matching `inviteId`. |
| **Admin auth** | Email + password (or Google SAML) via Firebase Auth; UI guarded by SvelteKit hooks. |
| **HTTPS** | Managed TLS on your VPS / CDN fronting the SvelteKit container. |
| **Secrets** | Firebase service keys and SendGrid API keys mounted as Docker secrets or env vars (never committed). |

---

## 5. Development & CI/CD

1. **Local emulators** (Auth, Firestore, Storage, Functions) are launched via `docker compose up emulators`.  
2. Frontend dev server proxies to `localhost:4000` Emulator UI; zero Cloud costs while coding.  
3. **GitHub Actions** workflow:  
   * Build & test SvelteKit ➜ push container to registry.  
   * `firebase deploy --only hosting,functions,firestore:rules,storage:rules` for staging & prod.  

---

## 6. Scalability & Cost

* Firestore auto-scales from hundreds of reads/writes per second; pay-as-you-go suits a single-event workload.  
* Cloud Functions scale to zero; billed only while executing (deadline job ≈ 43,200 invocations/month ≈ free tier).  
* Storage costs are pennies for a few MB of QR codes and CSV exports.  
* Outbound e-mail cost dominated by your SendGrid/SES plan.

---

## 7. Future-Proofing

* **Swap backend**: Should you outgrow Firebase, the frontend can point to a REST API (FastAPI, Go, etc.) with minimal refactor.  
* **Multi-event mode**: Add `eventId` to Auth claims & Firestore paths to reuse the platform for conferences, reunions, etc.  
* **PWA / Offline**: Firestore offline persistence and Service Workers make the invite portal usable with flaky reception.

---

> **TL;DR** – We self-host only the SvelteKit SSR service for full control over URLs, SEO, and theming; everything else—auth, data, files, jobs, email—is offloaded to **Firebase** so contributors can focus on features, not ops.
