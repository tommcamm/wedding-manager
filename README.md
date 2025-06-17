# Tommy's Wedding Manager

A multilingual web application for effortlessly managing all invitations, RSVPs, and wedding-day logistics for **Tommy & Sammy's wedding – June 2026**.

---

## ✨ Overview
Tommy's Wedding Manager provides:

1. **Administration interface** – a secure dashboard where wedding planners can control and monitor every aspect of guest management.  
2. **Invitee interface** – a personalized portal for each guest (or family) enabling them to RSVP **for every person named on the invitation _and_ for any allowed +1s**, specify dietary needs, select gifts from the registry, and more.

The platform is fully localized in **English (default), Italian, and Chinese**, with each invite link or QR code automatically opening in the recipient's preferred language.

---

## 🌟 Core Features

### 1. Administration Interface
| Capability | Details |
|------------|---------|
| **Authentication** | Password-protected login for planners and helpers. |
| **Invitee Management** | • Add or remove invitees (individually or by family) <br>• Adjust the allowed number of +1s per invitee <br>• Override limits to add extra guests manually |
| **RSVP Deadline Control** | • Set a global RSVP deadline (visible to guests) <br>• After the deadline, guest portals automatically become **read-only** |
| **Communication** | • Send emails to all or filtered invitees <br>• Publish news/announcements visible in guest portals |
| **Exports & Reporting** | • Download RSVP data, dietary requirements, and gift selections in CSV/Excel |
| **Localization Tools** | Manage translations for English, Italian, and Chinese text strings. |

### 2. Invitee Interface
| Capability | Details |
|------------|---------|
| **Personalized Access** | Each invite contains a unique **5-character shortcode** or QR code. |
| **Per-Person RSVP** | • Accept or decline **individually** for each person already listed on the invitation <br>• Add or remove +1s up to the configured allowance (and within the deadline) |
| **Dietary Preferences** | Provide allergies or special diets for every attendee, including +1s. |
| **Gift Registry** | Browse items, mark selections as "taken", or follow links to e-money boxes for cash gifts. |
| **Notes to Couple** | Free-text field for guests to leave messages or special requests. |
| **RSVP Deadline Banner** | Prominent countdown / date banner shows the RSVP deadline; after it passes, the interface switches to view-only with a prompt to **contact the couple for changes**. |
| **Multilingual UX** | Full interface available in English, Italian, and Chinese based on the invite link. |

---

## 📋 Functional Requirements

1. **One invite per family**  
   *An invite may already list multiple family members; each can RSVP separately. Additional +1s can be added or removed up to the specified allowance **before the deadline**.*

2. **RSVP Deadline**  
   *A configurable cutoff date after which the guest portal locks. Guests see a message directing them to contact the couple for any modifications.*

3. **Dietary Preferences & Allergies**  
   *Captured individually for every named attendee and +1.*

4. **Gift Flexibility**  
   *Guests can choose a registry item **or** contribute via linked e-money boxes. A note clarifies that all forms of gifts, including cash, are appreciated.*

5. **Real-time Admin Visibility**  
   *All RSVPs, notes, and gift selections appear instantly in the admin dashboard.*

6. **Localization**  
   *All content (UI labels, emails, registry text, etc.) must be translatable into English, Italian, and Chinese.*

---

## 🌍 Localization Strategy

* **Language indicator** is embedded in each invite URL/QR code (`/invite/ABCDE?lang=it`).  
* Translatable strings live in resource files (`en.json`, `it.json`, `zh.json`).  
* Admin dashboard includes an editor for live translation updates.

---

## 🚀 Docker Setup

The application is containerized for easy deployment and development.

### Development Setup

For local development, you can run just the required services (PostgreSQL, Redis, MinIO, MailHog) while running the SvelteKit application directly on your machine:

1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

2. Start the development dependencies:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. Run the SvelteKit application:
   ```bash
   pnpm dev
   ```

4. Access the application at http://localhost:3000

5. Other services are available at:
   - MailHog: http://localhost:8025
   - MinIO Console: http://localhost:9001

### Production Setup

For production deployment, the full stack can be run with Docker Compose:

1. Configure your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with production values
   ```

2. Start the full stack:
   ```bash
   docker compose up -d
   ```

3. The application and all services will be available through Traefik.

---

## 🗺️ Project Roadmap (high-level)

1. **MVP** – Core admin panel, invite generation, RSVP flow with deadline enforcement, CSV export.  
2. **Gift Registry Module** – Item reservation, e-money box integration.  
3. **Email & Notification System** – Templated multilingual emails, news broadcast, deadline reminders.  
4. **Analytics & Reporting Enhancements** – Dashboard charts, attendance forecasting.  
5. **Polish & Deployment** – Final UI/UX tweaks, production hosting, security hardening.

---

## 🤝 Contributing

Pull requests and ideas are welcome! Please open an issue to discuss major changes.

---

## 📄 License

MIT – see `LICENSE` file for details.
