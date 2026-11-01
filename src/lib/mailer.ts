import nodemailer, { type Transporter } from 'nodemailer'
import { SITE } from '@/data/portfolio'
import type { ContactInput } from './contact'

const REQUIRED_ENV = ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'CONTACT_RECEIVER'] as const

function getEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k])
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  return {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_APP_PASSWORD!,
    receiver: process.env.CONTACT_RECEIVER!,
  }
}

let transporter: Transporter | null = null
function getTransporter(user: string, pass: string) {
  transporter ??= nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
  return transporter
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => HTML_ESCAPES[c])
const stripNewlines = (s: string) => s.replace(/[\r\n]+/g, ' ')

const ROW = 'padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);'
const LABEL = `color:#8a8a8a;font-size:12px;${ROW}`

/** Notification to the site owner. Throws if it fails — the submission is lost otherwise. */
export async function sendContactMail(input: ContactInput) {
  const { user, pass, receiver } = getEnv()
  const mail = getTransporter(user, pass)

  const name = escapeHtml(input.fromName.trim())
  const email = escapeHtml(input.fromEmail.trim())
  const subject = escapeHtml(input.subject.trim())
  const message = escapeHtml(input.message.trim())

  await mail.sendMail({
    from: `"Portfolio Contact" <${user}>`,
    to: receiver,
    replyTo: input.fromEmail.trim(),
    subject: `[Portfolio] ${stripNewlines(input.subject.trim())}`,
    text: `Name: ${input.fromName}\nEmail: ${input.fromEmail}\nSubject: ${input.subject}\n\n${input.message}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#090909;color:#f0ede8;border-radius:16px;overflow:hidden;">
        <div style="background:#c8f35a;padding:24px 32px;">
          <h2 style="margin:0;color:#090909;font-size:20px;font-weight:800;">New message from your portfolio</h2>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="${LABEL}width:120px;">Name</td><td style="${ROW}font-weight:600;">${name}</td></tr>
            <tr><td style="${LABEL}">Email</td><td style="${ROW}"><a href="mailto:${email}" style="color:#c8f35a;">${email}</a></td></tr>
            <tr><td style="${LABEL}">Subject</td><td style="${ROW}">${subject}</td></tr>
          </table>
          <div style="margin-top:24px;">
            <p style="color:#8a8a8a;font-size:12px;margin-bottom:10px;">Message</p>
            <p style="line-height:1.75;white-space:pre-wrap;background:rgba(255,255,255,0.04);padding:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);">${message}</p>
          </div>
        </div>
      </div>
    `,
  })
}

/**
 * Confirmation to the sender. Deliberately contains NO user-supplied content,
 * so the form can't be abused to send arbitrary text from this Gmail account.
 */
export async function sendAutoReply(to: string) {
  const { user, pass } = getEnv()
  const mail = getTransporter(user, pass)

  await mail.sendMail({
    from: `"${SITE.name}" <${user}>`,
    to: to.trim(),
    subject: `Thanks for reaching out — ${SITE.name}`,
    text: `Hi there,\n\nThanks for your message — I've received it and will get back to you as soon as possible, usually within 24 hours.\n\nBest regards,\n${SITE.name}\n${SITE.title} · ${SITE.location}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#090909;color:#f0ede8;border-radius:16px;overflow:hidden;">
        <div style="background:#c8f35a;padding:24px 32px;">
          <h2 style="margin:0;color:#090909;font-size:20px;font-weight:800;">Thanks for reaching out!</h2>
        </div>
        <div style="padding:32px;">
          <p style="margin-bottom:16px;">Hi there,</p>
          <p style="color:#a0a0a0;line-height:1.75;margin-bottom:24px;">I've received your message and will get back to you as soon as possible — usually within 24 hours.</p>
          <p style="color:#a0a0a0;">Best regards,<br/><strong style="color:#f0ede8;">${SITE.name}</strong><br/><span style="color:#c8f35a;font-size:13px;">${SITE.title}</span></p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:#8a8a8a;">
          ${SITE.location} &nbsp;·&nbsp; ${SITE.email}
        </div>
      </div>
    `,
  })
}
