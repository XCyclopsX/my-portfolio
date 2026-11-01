import isEmail from 'validator/lib/isEmail'

export interface ContactInput {
  fromName: string
  fromEmail: string
  subject: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

export const LIMITS = {
  fromName: 100,
  fromEmail: 254,
  subject: 150,
  message: 5000,
  messageMin: 10,
} as const

/** Shared by the form (instant feedback) and the API route (source of truth). */
export function validateContact(input: ContactInput): ContactErrors {
  const e: ContactErrors = {}
  const name = input.fromName.trim()
  const email = input.fromEmail.trim()
  const subject = input.subject.trim()
  const message = input.message.trim()

  if (!name) e.fromName = 'Name is required.'
  else if (name.length > LIMITS.fromName) e.fromName = `Name must be under ${LIMITS.fromName} characters.`

  if (!email) e.fromEmail = 'Email is required.'
  else if (email.length > LIMITS.fromEmail || !isEmail(email)) e.fromEmail = 'Please enter a valid email address.'

  if (!subject) e.subject = 'Subject is required.'
  else if (subject.length > LIMITS.subject) e.subject = `Subject must be under ${LIMITS.subject} characters.`

  if (!message) e.message = 'Message is required.'
  else if (message.length < LIMITS.messageMin) e.message = 'Message is too short.'
  else if (message.length > LIMITS.message) e.message = `Message must be under ${LIMITS.message} characters.`

  return e
}
