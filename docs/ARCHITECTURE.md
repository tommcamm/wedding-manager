# Architecture  
*Tommy’s Wedding Manager – Self-hosted Docker-Compose design*

---

## 1. High-Level Overview

The platform is **container-native**: one image for the application code (UI + API + jobs) and a small set of stateful sidecars.  
Everything is started with **`docker compose up -d`**.

| Layer | Responsibility | Technology |
|-------|----------------|------------|
| **SSR Frontend + API (single container)** | • Server-side render guest & admin pages<br>• REST/GraphQL endpoints<br>• Background worker (cron, e-mails)<br>• Locale selection & secret-code validation | **SvelteKit** (Node adapter),<br>**Drizzle ORM**, **BullMQ** |
| **Reverse-proxy** | • TLS termination (Let’s Encrypt)<br>• Routing `/invite/*`, `/admin/*`, `/api/*`<br>• Rate-limit invite codes to deter brute-force | **Traefik** |
| **Relational DB** | • Invites, guests, admins, sessions, jobs | **PostgreSQL 16** |
| **Object Storage (bucket)** | • QR codes, registry images, CSV/Excel exports | **MinIO** (S3 API) |
| **Cache & Queue** | • Session store for Auth<br>• BullMQ job broker | **Redis** |
| *(dev only)* **Mail capture** | • View outbound email locally | **MailHog** |

The **app container** mounts environment secrets (DB, SMTP, MinIO keys). All other services persist data via Docker volumes.

---

## 2. Core Self-Hosted Components

| Component | What We Store / Handle | Notes & Rules |
|-----------|------------------------|---------------|
| **PostgreSQL** | Tables: `invites`, `guests`, `admins`, `sessions`, `jobs` | Strict foreign keys; generated migrations via Drizzle |
| **MinIO** | `qr/<code>.png`, `exports/*.csv`, `registry/<img>.jpg` | Presigned URLs; private bucket except registry thumbnails |
| **Redis** | • Lucia session cache<br>• BullMQ queues (`emails`, `cron`) | In-memory; persistence optional |
| **Traefik** | HTTPS, HTTP/3, ACME certs | Middleware rate-limiting `/invite/*` |
| **Lucia Auth** | Admin login (email + password), HttpOnly signed cookie | Passwords hashed with bcrypt |
| **BullMQ Jobs** | • RSVP-deadline sweeps<br>• Bulk emails<br>• CSV generation | Runs inside the same image; scheduled with `cron:` syntax |

---

## 3. End-to-End Data Flow Scenarios

### 3.1 Guest RSVPs
1. **Invite link** `https://mywedding.app/invite/ABCDE?lang=it` hits Traefik and reaches SvelteKit server.  
2. Server queries **PostgreSQL** for invite `ABCDE`; rejects if missing, locked, or expired.  
3. On success, SSR returns HTML pre-filled with guest data.  
4. Guest updates RSVP → `POST /api/rsvp` → Drizzle writes to DB; optional file uploads stream to **MinIO**.  
5. BullMQ listener fires confirmation e-mail and pushes SSE/WebSocket event to admin dashboard.

### 3.2 RSVP Deadline
1. BullMQ **cron job** runs every minute inside the app container.  
2. Job sets `locked=true` for invites whose `deadline < now`.  
3. Frontend detects `locked` flag and renders view-only banner instructing guests to contact the couple.

### 3.3 Bulk Email Reminder
1. Admin clicks “Send reminder” in dashboard (protected by Lucia session).  
2. `POST /api/email/reminder` enqueues a BullMQ batch per preferred language.  
3. Worker streams templated e-mails via Nodemailer → SMTP (Mailgun/SES/etc.).  
4. Status updates appear in real-time via SSE.

---

## 4. Security & Access Control

| Concern | Mechanism |
|---------|-----------|
| **Secret invite codes** | Server-side validation, Traefik rate-limit, 5-char base-36 codes (~60 M space). |
| **Admin auth** | Lucia sessions, bcrypt hashes, CSRF protection via same-site cookies. |
| **Data isolation** | Invite code is primary key; joins only expose rows belonging to that code. |
| **HTTPS** | Traefik auto-renew LetsEncrypt certificates; HTTP→HTTPS redirect. |
| **Secrets management** | `.env` + Docker secrets; never committed to VCS. |
| **Email spoofing** | SPF/DKIM configured on SMTP provider; from-address is a custom domain. |

---

## 5. Development & CI/CD

1. **Local development**: `docker compose up` boots Postgres, Redis, MinIO, MailHog; app runs with hot-reload (`pnpm dev`).  
2. **Tests & lint** run inside a lightweight Node container in GitHub Actions.  
3. **Build**: multi-stage Dockerfile (`pnpm build && pnpm package`).  
4. **Deploy**: push image to registry; production host runs `docker compose pull && docker compose up -d`.  
5. **DB migrations**: Drizzle migrations executed automatically on container start (idempotent).

---

## 6. Scalability & Cost

* **Vertical scaling first** – app is stateless; replicate container and add Traefik load-balancing if needed.  
* **PostgreSQL** handles hundreds of concurrent guests; enable WAL archiving for point-in-time recovery.  
* **MinIO** stores only a few MB/GB; can be replaced with AWS S3 by switching endpoint/env vars.  
* **Redis** memory footprint is tiny (sessions + job queue).  
* Email costs scale with provider (typically <$10 for event-sized traffic).

---

## 7. Future-Proofing

* **Swap any service**: MinIO → S3, Redis → RDS Elasticache, Traefik → Nginx, with minimal code changes.  
* **Multi-event mode**: add `event_id` column in every table; same stack can host multiple weddings.  
* **Edge caching / CDN**: front HTML via Cloudflare if expecting global traffic.  
* **Serverless option**: Container can be ported to Fly.io or AWS Fargate for pay-per-second runtime.

---

> **TL;DR** – One Docker image contains all business logic (SvelteKit + Drizzle + BullMQ).  
> A single `docker-compose.yml` starts Traefik, Postgres, Redis, MinIO, and the app, giving contributors a **one-command, fully reproducible environment** with no external cloud dependencies.
