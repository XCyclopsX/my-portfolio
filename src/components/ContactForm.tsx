'use client'

import { useState, type ChangeEvent, type FormEvent, type ReactElement } from 'react'
import { LIMITS, validateContact, type ContactErrors, type ContactInput } from '@/lib/contact'
import { SITE } from '@/data/portfolio'

const EMPTY: ContactInput = { fromName: '', fromEmail: '', subject: '', message: '' }

const CONTACT_LINKS = [
  { icon: '✉', label: SITE.email, href: `mailto:${SITE.email}` },
  { icon: '☎', label: SITE.phone.display, href: SITE.phone.href },
  { icon: '🔗', label: 'LinkedIn', href: SITE.linkedin, external: true },
  { icon: '♥', label: 'GitHub', href: SITE.github, external: true },
  { icon: '↓', label: 'Download CV (PDF)', href: SITE.resume.href, download: SITE.resume.fileName },
]

export default function ContactForm() {
  const [form, setForm] = useState<ContactInput>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validateContact(form)
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    setStatus({ type: '', text: '' })

    // Honeypot — real users never see or fill this field
    const website = new FormData(e.currentTarget).get('website')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus({ type: 'success', text: '✓ Message sent! I will get back to you soon.' })
        setForm(EMPTY)
        setErrors({})
      } else {
        if (data.fields) setErrors(data.fields)
        setStatus({ type: 'error', text: data.error || 'Something went wrong.' })
      }
    } catch {
      setStatus({ type: 'error', text: `Network error. Please email me directly at ${SITE.email}.` })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as keyof ContactInput
    setForm(prev => ({ ...prev, [name]: e.target.value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const fieldProps = (name: keyof ContactInput) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    className: `form-input${errors[name] ? ' invalid' : ''}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    required: true,
  })

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-glow" aria-hidden="true" />

      <div className="container contact-grid">
        <div className="contact-left">
          <p className="pill">✦ LET&apos;S CONNECT</p>
          <h2 id="contact-title" className="contact-title">
            Let&apos;s build<br /><span className="accent">something.</span>
          </h2>
          <p className="contact-intro">
            Open to remote and onsite opportunities.<br />Drop a message and I&apos;ll get back to you.
          </p>
          <ul className="contact-links">
            {CONTACT_LINKS.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="contact-link"
                  {...(l.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  {...(l.download && { download: l.download })}
                >
                  <span aria-hidden="true">{l.icon}</span>{l.label}
                  {l.external && <span className="sr-only"> (opens in new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card contact-right">
          <form onSubmit={handleSubmit} noValidate className="contact-form">
            <div className="form-row">
              <Field id="contact-fromName" label="Your Name" error={errors.fromName}>
                <input {...fieldProps('fromName')} type="text" autoComplete="name" maxLength={LIMITS.fromName} placeholder="John Doe" />
              </Field>
              <Field id="contact-fromEmail" label="Your Email" error={errors.fromEmail}>
                <input {...fieldProps('fromEmail')} type="email" autoComplete="email" maxLength={LIMITS.fromEmail} placeholder="john@example.com" />
              </Field>
            </div>

            <Field id="contact-subject" label="Subject" error={errors.subject}>
              <input {...fieldProps('subject')} type="text" maxLength={LIMITS.subject} placeholder="Project collaboration, job opportunity..." />
            </Field>

            <Field id="contact-message" label="Message" error={errors.message}>
              <textarea {...fieldProps('message')} maxLength={LIMITS.message} placeholder="Tell me about your project or opportunity..." />
            </Field>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="btn-submit" disabled={loading} aria-busy={loading}>
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
              <span aria-hidden="true">{loading ? '⏳' : '→'}</span>
            </button>

            <p role="status" aria-live="polite" className={`form-status${status.type ? ` form-status--${status.type}` : ''}`}>
              {status.text}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactElement }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error && <span id={`${id}-error`} className="field-error">{error}</span>}
    </div>
  )
}
