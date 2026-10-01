// // Envía el email "We're live" a todos los usuarios de la tabla `waitlist`.
// //
// // Uso:
// //   node --env-file=.env.local scripts/send-launch-email.mjs            # dry-run (no envía)
// //   node --env-file=.env.local scripts/send-launch-email.mjs --send     # envía de verdad
// //
// // Requiere en el entorno:
// //   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (la anon key no puede leer waitlist),
// //   RESEND_API_KEY, EMAIL_FROM, NEXT_PUBLIC_SITE_URL
// //
// // Es seguro relanzarlo: cada envío usa una idempotency key por destinatario
// // (Resend la respeta ~24h), así que no se duplican correos si se corta a medias.

// import { createClient } from '@supabase/supabase-js'
// import { Resend } from 'resend'

// const TEMPLATE_ID = 'we-are-live' // id/alias del template creado en Resend
// const SUBJECT = "We're live — One question daily"
// const DELAY_MS = 600 // Resend limita a 2 req/s por defecto
// const PAGE_SIZE = 1000

// const shouldSend = process.argv.includes('--send')

// function requireEnv(name) {
//   const value = process.env[name]
//   if (!value) {
//     console.error(`Missing env var: ${name}`)
//     process.exit(1)
//   }
//   return value
// }

// const supabase = createClient(
//   requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
//   requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
//   { auth: { persistSession: false } }
// )
// const resend = new Resend(requireEnv('RESEND_API_KEY'))
// const from = requireEnv('EMAIL_FROM')
// const siteUrl = requireEnv('NEXT_PUBLIC_SITE_URL')

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// async function fetchWaitlistEmails() {
//   const emails = new Set()

//   for (let offset = 0; ; offset += PAGE_SIZE) {
//     const { data, error } = await supabase
//       .from('waitlist')
//       .select('email')
//       .order('email')
//       .range(offset, offset + PAGE_SIZE - 1)

//     if (error) throw error
//     for (const row of data) emails.add(row.email.trim().toLowerCase())
//     if (data.length < PAGE_SIZE) break
//   }

//   return [...emails]
// }

// async function sendOne(email) {
//   const { data, error } = await resend.emails.send(
//     {
//       from,
//       to: email,
//       subject: SUBJECT,
//       template: {
//         id: TEMPLATE_ID,
//         variables: { SITE_URL: siteUrl },
//       },
//     },
//     { idempotencyKey: `launch-email/${email}` }
//   )

//   if (error) {
//     // 429: esperar y reintentar una vez
//     if (error.statusCode === 429) {
//       await sleep(2000)
//       return sendOne(email)
//     }
//     return { ok: false, error: error.message }
//   }

//   return { ok: true, id: data.id }
// }

// async function main() {
//   const emails = await fetchWaitlistEmails()
//   console.log(`Waitlist: ${emails.length} unique emails`)

//   if (!shouldSend) {
//     console.log('Dry run — nothing sent. Re-run with --send to send for real.')
//     return
//   }

//   let sent = 0
//   const failed = []

//   for (const email of emails) {
//     const result = await sendOne(email)

//     if (result.ok) {
//       sent++
//       console.log(`[${sent + failed.length}/${emails.length}] sent ${email}`)
//     } else {
//       failed.push(email)
//       console.error(`[${sent + failed.length}/${emails.length}] FAILED ${email}: ${result.error}`)
//     }

//     await sleep(DELAY_MS)
//   }

//   console.log(`Done. Sent: ${sent}, failed: ${failed.length}`)
//   if (failed.length) {
//     console.log('Failed emails:\n' + failed.join('\n'))
//     process.exitCode = 1
//   }
// }

// main().catch((err) => {
//   console.error(err)
//   process.exit(1)
// })
