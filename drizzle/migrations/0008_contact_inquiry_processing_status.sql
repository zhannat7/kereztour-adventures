ALTER TABLE public.contact_messages ADD COLUMN status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.contact_messages ADD CONSTRAINT contact_messages_status_valid CHECK (status IN ('pending', 'in_progress', 'completed'));
NOTIFY pgrst, 'reload schema';