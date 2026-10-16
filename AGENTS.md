
- Public form edge functions (create-booking, create-contact-message) use the SDK wildcard corsHeaders — origin allowlists silently blocked mobile browsers; security comes from server-side validation + RLS.
- Extend the existing /admin dashboard rather than creating another admin entry point; database admin policies remain the authorization boundary.
- Keep contact inquiry controls in a dedicated admin component and persist processing status in contact_messages; only update displayed status after a successful database read-back.
