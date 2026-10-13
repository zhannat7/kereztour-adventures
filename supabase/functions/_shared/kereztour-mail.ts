import { sendTemplateEmail } from './transactional-email-templates/send-email.ts'

export const NOTIFY_EMAIL = 'kereztour@hotmail.com'

export interface KereztourMail {
  subject: string
  heading?: string
  paragraphs?: string[]
  rows?: { label: string; value: string }[]
  closing?: string[]
}

/** Sends a Kereztour email; logs and swallows errors so the request never fails because of email. */
export async function sendKereztourMail(to: string, mail: KereztourMail, idempotencyKey: string): Promise<boolean> {
  try {
    const res = await sendTemplateEmail('kereztour-message', to, { templateData: { ...mail }, idempotencyKey })
    if (!res.sent) console.warn(`Email to ${to} suppressed`)
    return res.sent
  } catch (error) {
    console.error(`Email failed for ${to}:`, error)
    return false
  }
}
