import { NextRequest, NextResponse } from 'next/server'
import { sendAutoReply, sendContactMail } from '@/lib/mailer'
import { validateContact, type ContactInput } from '@/lib/contact'
import { isRateLimited } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const MAX_BODY_BYTES = 20_000

const isString = (v: unknown): v is string => typeof v === 'string'

function clientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413 })
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot filled → almost certainly a bot. Pretend success so it doesn't retry.
  if (body?.website) return NextResponse.json({ success: true })

  const { fromName, fromEmail, subject, message } = body ?? {}
  if (![fromName, fromEmail, subject, message].every(isString)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const input = { fromName, fromEmail, subject, message } as ContactInput
  const fields = validateContact(input)
  if (Object.keys(fields).length) {
    return NextResponse.json({ error: Object.values(fields)[0], fields }, { status: 400 })
  }

  try {
    await sendContactMail(input)
  } catch (err) {
    console.error('[contact] notification failed', err)
    return NextResponse.json({ error: 'Server error. Please try again or email me directly.' }, { status: 500 })
  }

  // The message is already delivered — a failed confirmation shouldn't make the user resend it
  try {
    await sendAutoReply(input.fromEmail)
  } catch (err) {
    console.error('[contact] auto-reply failed', err)
  }

  return NextResponse.json({ success: true })
}
