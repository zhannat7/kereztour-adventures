import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Row { label: string; value: string }
interface Props {
  subject?: string
  heading?: string
  paragraphs?: string[]
  rows?: Row[]
  closing?: string[]
}

const KereztourMessage = ({ heading, paragraphs = [], rows = [], closing = [] }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>{heading || 'Nachricht von Kereztour'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>KEREZTOUR</Text>
        {heading ? <Heading style={h1}>{heading}</Heading> : null}
        {paragraphs.map((p, i) => <Text key={i} style={text}>{p || '\u00a0'}</Text>)}
        {rows.length > 0 ? (
          <Section style={box}>
            {rows.map((r, i) => (
              <Text key={i} style={rowText}><strong>{r.label}:</strong> {r.value || '-'}</Text>
            ))}
          </Section>
        ) : null}
        {closing.map((p, i) => <Text key={`c${i}`} style={text}>{p}</Text>)}
        <Hr style={hr} />
        <Text style={small}>Kereztour · Antworten bitte an kereztour@hotmail.com</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: KereztourMessage,
  subject: (d: Record<string, any>) => (typeof d.subject === 'string' && d.subject) || 'Nachricht von Kereztour',
  displayName: 'Kereztour Nachricht',
  previewData: {
    subject: 'Deine Buchungsanfrage bei Kereztour',
    heading: 'Vielen Dank für deine Buchungsanfrage!',
    paragraphs: ['Hallo Anna,', 'wir haben deine Anfrage erhalten.'],
    rows: [{ label: 'Reise', value: 'Kultur Tour' }, { label: 'Personen', value: '2' }],
    closing: ['Herzliche Grüße', 'Sarina & das Kereztour-Team'],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const brand = { color: '#0f5132', fontSize: '13px', letterSpacing: '3px', fontWeight: 700, margin: '0 0 16px' }
const h1 = { color: '#0f3d2e', fontSize: '24px', fontFamily: 'Georgia, serif', margin: '0 0 16px' }
const text = { color: '#1f2937', fontSize: '15px', lineHeight: '1.6', margin: '0 0 10px' }
const box = { backgroundColor: '#f7f3ea', borderRadius: '8px', padding: '12px 16px', margin: '12px 0' }
const rowText = { color: '#1f2937', fontSize: '14px', lineHeight: '1.5', margin: '4px 0' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
const small = { color: '#6b7280', fontSize: '12px' }
