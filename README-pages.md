# Wedding Manager Page Structure

This document outlines the basic structure and navigation flow of the Wedding Manager application.

## Application Structure

The application is divided into two main sections:

1. **Guest Area**: Public-facing area where guests can access their invitations using a unique code
2. **Admin Area**: Protected area for the wedding couple to manage invitations, guest lists, and settings

## Pages and Navigation Flow

### Guest Area

1. **Landing Page** (`/`)
   - Entry point for guests
   - Displays wedding basic information
   - Has a form to enter invitation code
   - Links to invitation details page

2. **Invitation Page** (`/invite/[code]`)
   - Shows personalized invitation details
   - Displays the guest list associated with this invitation
   - Provides links to RSVP, dietary preferences, gift registry, and notes

3. **RSVP Management** (`/invite/[code]/rsvp`)
   - Allows guests to confirm or decline attendance
   - Supports adding/removing plus ones (within allowed limit)
   - Saves RSVP status for all guests

4. **Dietary Preferences** (`/invite/[code]/dietary`)
   - Allows guests to specify dietary restrictions
   - Supports multiple dietary options (vegetarian, vegan, allergies, etc.)
   - Includes space for additional notes

5. **Gift Registry** (`/invite/[code]/gifts`)
   - Displays list of gift options
   - Allows guests to reserve gifts
   - Shows cash gift options and payment links

6. **Notes to Couple** (`/invite/[code]/notes`)
   - Allows guests to leave personal messages
   - Provides message suggestions and ideas
   - Saves notes for the couple to view later

### Admin Area

1. **Login Page** (`/admin/login`)
   - Secure login for the wedding couple
   - Authentication with email/password
   - Redirects to dashboard upon successful login

2. **Dashboard** (`/admin`)
   - Overview of wedding statistics
   - Shows counts of invitations, responses, etc.
   - Quick links to other admin sections

3. **Invitation Management** (`/admin/invites`) - Planned
   - List all invitations
   - Create, edit, delete invitations
   - Send/resend invitation emails

4. **Guest List** (`/admin/guests`) - Planned
   - View and manage complete guest list
   - Filter and search functionality
   - Export guest list and details

5. **Settings** (`/admin/settings`) - Planned
   - Configure wedding details
   - Set RSVP deadlines
   - Customize email templates

6. **Communications** (`/admin/communications`) - Planned
   - Send emails to guests
   - Track email status
   - Create email templates

7. **Reports** (`/admin/reports`) - Planned
   - Generate reports on RSVPs
   - View dietary requirements summary
   - Export data for venue/catering

## Localization Support

The application supports multiple languages:

- English (en)
- Italian (it)
- Chinese (zh)

Each page detects and displays content in the appropriate language based on the invitation's language setting or URL parameter.

## Demo Credentials

For demonstration purposes, use:

- Email: admin@example.com
- Password: password

## Technical Notes

- Mock data is used for demonstration purposes
- In a production environment, these would be connected to a database
- The application uses responsive design and works on mobile and desktop devices
