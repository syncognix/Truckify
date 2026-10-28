import { AnimatePresence, m } from 'motion/react'
import { Check } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Knob } from '../components/Button'
import { SplitWords } from '../components/Reveal'
import { FactText } from '../components/Tbc'
import { EQUIPMENT } from '../data/content'
import { SITE } from '../data/site'
import { usePlottedLane } from '../lib/lane-store'

const EASE = [0.16, 1, 0.3, 1] as const
const FLEET_SIZES = ['1 truck', '2–5 trucks', '6–15 trucks', '16+ trucks'] as const

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(180deg,transparent,black_30%,black_70%,transparent)]" />
      <div className="shell relative grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 flex flex-col lg:col-span-6">
          <p className="label mb-8 flex items-center gap-3 text-ink-muted">
            <span className="text-accent-text">01</span>
            <span className="h-px w-8 bg-line-strong" />
            Consult request
          </p>
          <h2 id="contact-title" className="text-mega font-semibold tracking-[-0.055em]">
            <SplitWords text="Let’s fill" className="block" />
            <span className="block font-serif font-light italic tracking-[-0.03em]">
              <SplitWords text="your board." delay={0.15} />
            </span>
          </h2>
          <p className="mt-8 max-w-md text-lede text-ink-muted">
            Tell us about your truck and how you like to run. We’ll set up a no-obligation intro call to see if
            we’re the right fit.
          </p>

          <dl className="mt-auto grid gap-px overflow-hidden rounded-panel border border-line bg-line pt-0 sm:grid-cols-2 max-lg:mt-12">
            <ContactFact term="Email">
              <a href={`mailto:${SITE.email.value}`} className="hover:text-accent-text">
                <FactText fact={SITE.email} />
              </a>
            </ContactFact>
            <ContactFact term="Phone">
              <a href={`tel:${SITE.phone.value.replace(/[^\d+]/g, '')}`} className="hover:text-accent-text">
                <FactText fact={SITE.phone} />
              </a>
            </ContactFact>
            <ContactFact term="Desk hours">
              <FactText fact={SITE.hours} />
            </ContactFact>
            <ContactFact term="Based in">
              <FactText fact={SITE.location} />
            </ContactFact>
          </dl>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <InquiryForm />
        </div>
      </div>
    </section>
  )
}

function ContactFact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="bg-bg p-5">
      <dt className="label text-ink-faint">{term}</dt>
      <dd className="mt-2 text-[0.98rem] font-medium tracking-[-0.01em]">{children}</dd>
    </div>
  )
}

interface FormState {
  name: string
  email: string
  phone: string
  authority: string
  equipment: string
  fleet: string
  lanes: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', phone: '', authority: '', equipment: '', fleet: '', lanes: '', message: '' }

/**
 * No backend is connected yet, so submission composes an email in the
 * visitor's mail app (mailto). Swap `submit` for an API call when one exists.
 */
function InquiryForm() {
  const lane = usePlottedLane()
  const [form, setForm] = useState<FormState>(() => ({ ...EMPTY, lanes: lane }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [sent, setSent] = useState(false)

  // A lane plotted on the map is appended to the lanes field (adjust-state-on-change pattern).
  const [seenLane, setSeenLane] = useState(lane)
  if (lane !== seenLane) {
    setSeenLane(lane)
    if (lane && !form.lanes.includes(lane)) setForm({ ...form, lanes: form.lanes ? `${form.lanes}; ${lane}` : lane })
  }

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email so we can reply.'
    if (!form.equipment) next.equipment = 'Choose your main equipment type.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      // Error attributes land on the next render; focus the first flagged field after it.
      const formEl = event.currentTarget
      requestAnimationFrame(() => formEl.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || '—'}`,
      `MC / DOT: ${form.authority || '—'}`,
      `Equipment: ${form.equipment}`,
      `Fleet size: ${form.fleet || '—'}`,
      `Preferred lanes: ${form.lanes || '—'}`,
      '',
      form.message,
    ].join('\n')
    const subject = `Dispatch consult — ${form.name}`
    window.location.href = `mailto:${SITE.email.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="glass glass-sheen relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <m.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[32rem] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-ink">
              <Check className="size-6" />
            </span>
            <h3 className="mt-8 text-[2.2rem] leading-none font-semibold tracking-[-0.045em]">Almost there.</h3>
            <p className="mt-4 max-w-sm text-ink-muted">
              Your email app should have opened with your details filled in — just hit send. If it didn’t, write
              to us directly at <FactText fact={SITE.email} className="text-ink" />.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="label mt-8 text-accent-text underline-offset-4 hover:underline"
            >
              ← Edit details
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-x-4 gap-y-5"
            aria-label="Dispatch consultation request"
          >
            <div className="label col-span-2 flex items-center justify-between text-ink-faint">
              <span>Consult request</span>
              <span>* required</span>
            </div>
            <Field label="Name *" error={errors.name} className="col-span-2 sm:col-span-1">
              {(p) => <input {...p} autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} />}
            </Field>
            <Field label="Email *" error={errors.email} className="col-span-2 sm:col-span-1">
              {(p) => (
                <input {...p} type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} />
              )}
            </Field>
            <Field label="Phone" className="col-span-2 sm:col-span-1">
              {(p) => <input {...p} type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} />}
            </Field>
            <Field label="MC / DOT number" className="col-span-2 sm:col-span-1">
              {(p) => <input {...p} inputMode="numeric" value={form.authority} onChange={(e) => set('authority')(e.target.value)} />}
            </Field>
            <Field label="Equipment *" error={errors.equipment} className="col-span-2 sm:col-span-1">
              {(p) => (
                <select {...p} value={form.equipment} onChange={(e) => set('equipment')(e.target.value)}>
                  <option value="">Select…</option>
                  {EQUIPMENT.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                  <option>Other</option>
                </select>
              )}
            </Field>
            <fieldset className="col-span-2 sm:col-span-1">
              <legend className="label mb-2 text-ink-faint">Fleet size</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {FLEET_SIZES.map((s) => (
                  <label
                    key={s}
                    className={`cursor-pointer rounded-lg border px-2 py-2 text-center text-[0.8rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                      form.fleet === s ? 'border-accent bg-accent text-accent-ink' : 'border-line text-ink-muted hover:border-line-strong'
                    }`}
                  >
                    <input type="radio" name="fleet" value={s} checked={form.fleet === s} onChange={() => set('fleet')(s)} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="Preferred lanes or regions" className="col-span-2">
              {(p) => (
                <input {...p} placeholder="e.g. Texas ↔ Southeast, home weekends" value={form.lanes} onChange={(e) => set('lanes')(e.target.value)} />
              )}
            </Field>
            <Field label="Anything else?" className="col-span-2">
              {(p) => <textarea {...p} rows={3} value={form.message} onChange={(e) => set('message')(e.target.value)} />}
            </Field>

            <div className="col-span-2 mt-2 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xs text-[0.78rem] text-ink-faint">
                Opens your email app with these details. We don’t store anything on this site.
              </p>
              <button
                type="submit"
                className="group inline-flex items-center gap-3 rounded-full bg-accent py-2 pr-2 pl-6 font-medium text-accent-ink transition-colors duration-500 hover:bg-ink hover:text-bg active:scale-[0.98]"
              >
                Request my consult
                <Knob />
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}

const CONTROL =
  'w-full rounded-xl border bg-bg/60 px-4 py-3 text-[0.98rem] text-ink placeholder:text-ink-faint transition-[border-color,background-color] duration-300 outline-none focus:border-accent focus:bg-bg'

interface FieldRenderProps {
  id: string
  className: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: (props: FieldRenderProps) => ReactNode
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  const errId = `${id}-err`
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-2 block text-ink-faint">
        {label}
      </label>
      {children({
        id,
        className: `${CONTROL} ${error ? 'border-[#ff6b4a]' : 'border-line hover:border-line-strong'}`,
        ...(error ? { 'aria-invalid': true as const, 'aria-describedby': errId } : {}),
      })}
      {error && (
        <p id={errId} className="mt-1.5 text-[0.78rem] text-[#e2553a]">
          {error}
        </p>
      )}
    </div>
  )
}
