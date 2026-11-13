import React, { useEffect, useState } from 'react';
import { Copy, ArrowUpRight, Send, CheckCircle2, AlertCircle, ArrowUp } from 'lucide-react';
import { CONTACT_CHANNELS, PROFILE } from '../../data/profile.js';
import { SectionHeading } from '../common/SectionHeading';

export interface ContactSectionProps {
  contactService: any;
  onCopyChannel: (value: string, toastMessage: string) => void;
  onShowToast: (message: string, tone?: 'default' | 'error') => void;
}

/**
 * Section 07: Direct Contact Dispatch, Copyable Channels & Grounded Architectural Colophon.
 */
export function ContactSection({
  contactService,
  onCopyChannel,
  onShowToast
}: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    referenceId: string;
    submittedAt: string;
  } | null>(null);
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    const syncCooldown = () => {
      try {
        const status = contactService.getCooldownStatus(Date.now());
        setCooldownSec(status && !status.allowed ? Number(status.retryAfterSeconds) || 0 : 0);
      } catch {
        setCooldownSec(0);
      }
    };

    syncCooldown();
    const timer = window.setInterval(syncCooldown, 1000);
    return () => window.clearInterval(timer);
  }, [contactService]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorBanner(null);
    setSubmitting(true);

    try {
      const result = await contactService.submitInquiry(
        { name, email, subject, message, honeypot },
        Date.now()
      );
      if (result?.botDropped) {
        return;
      }
      const refId = result?.submission?.id || result?.delivery?.refId || 'INQ-SENT';
      setReceipt({
        referenceId: refId,
        submittedAt: result?.submission?.dateFormatted || new Date().toLocaleTimeString()
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      onShowToast(`Inquiry dispatched (${refId}).`);
    } catch (err: any) {
      const msg =
        err?.message || 'Unable to dispatch inquiry. Please verify your fields and try again.';
      setErrorBanner(msg);
      onShowToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-[1376px] px-5 sm:px-8 lg:px-14 pt-14 pb-12"
    >
      <SectionHeading
        index="07"
        label="Contact & Dispatch"
        title="LET'S CONNECT"
        subtitle="Always happy to connect, collaborate or chat about ML & SDE. Feel free to reach out!"
      />

      <div id="contact-heading" className="sr-only">
        Contact Mohan Kumar B.H
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.15fr] gap-8 items-start">
        {/* Left: Copyable Channels Ledger */}
        <div className="border border-[#0F100F] bg-[#F8F5E8]">
          <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-5 py-3 flex items-center justify-between">
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              CONTACT INFO
            </span>
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#B3371E]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >

            </span>
          </div>

          <div className="divide-y divide-[#C5C2B9]">
            {CONTACT_CHANNELS.map((channel) => (
              <div
                key={channel.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-[#F3EEE3]/40 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <div
                    className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#5C5B4F]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {channel.name}
                  </div>
                  <a
                    href={channel.href}
                    target={channel.type === 'external' ? '_blank' : undefined}
                    rel={channel.type === 'external' ? 'noopener noreferrer' : undefined}
                    className={`block truncate text-[15px] font-medium text-[#0F100F] no-underline hover:text-[#B3371E] transition-colors ${channel.tabular ? 'tabular-nums' : ''
                      }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {channel.displayValue}
                  </a>
                </div>

                {channel.type === 'copyable' ? (
                  <button
                    type="button"
                    onClick={() => onCopyChannel(channel.copyValue!, channel.copyToast!)}
                    aria-label={channel.copyLabel}
                    className="cursor-pointer shrink-0 inline-flex h-[34px] items-center gap-1.5 border border-[#434440] bg-[#F8F5E8] px-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0F100F] hover:border-[#B3371E] hover:text-[#B3371E] transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                ) : (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${channel.name}`}
                    className="shrink-0 inline-flex h-[34px] w-[34px] items-center justify-center border border-[#434440] bg-[#F8F5E8] text-[#0F100F] hover:border-[#B3371E] hover:text-[#B3371E] transition-colors"
                  >
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Validated Inquiry Dispatch Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="border border-[#0F100F] bg-[#F8F5E8] p-6 lg:p-7 space-y-5"
        >
          <div className="pb-3 border-b border-[#C5C2B9] flex items-center justify-between gap-3">
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Feel free to reach out
            </span>
            {cooldownSec > 0 && (
              <span
                className="font-mono text-[11px] tabular-nums text-[#B3371E]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                COOLDOWN: {cooldownSec}s
              </span>
            )}
          </div>

          {/* Spam honeypot (strictly visually hidden) */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="hp-company">Leave empty</label>
            <input
              id="hp-company"
              name="_gotcha"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span
                className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#434440]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Your Name *
              </span>
              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Recruiter or Engineer Name"
                className="w-full h-[42px] border border-[#434440] bg-[#F8F5E8] px-3.5 text-[14px] text-[#0F100F] placeholder:text-[#5C5B4F] focus:border-[#B3371E]"
              />
            </label>

            <label className="block space-y-1.5">
              <span
                className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#434440]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Email *
              </span>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-[42px] border border-[#434440] bg-[#F8F5E8] px-3.5 text-[14px] text-[#0F100F] placeholder:text-[#5C5B4F] focus:border-[#B3371E]"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span
              className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#434440]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Subject
            </span>
            <input
              type="text"
              name="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="AI/ML Engineer Role • Technical Collaboration"
              className="w-full h-[42px] border border-[#434440] bg-[#F8F5E8] px-3.5 text-[14px] text-[#0F100F] placeholder:text-[#5C5B4F] focus:border-[#B3371E]"
            />
          </label>

          <label className="block space-y-1.5">
            <span
              className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#434440]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Message *
            </span>
            <textarea
              name="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share role specifications, research discussion, or interview timeline..."
              className="w-full border border-[#434440] bg-[#F8F5E8] p-3.5 text-[14px] leading-[1.55] text-[#0F100F] placeholder:text-[#5C5B4F] focus:border-[#B3371E]"
            />
          </label>

          {errorBanner && (
            <div
              role="alert"
              className="border border-[#B3371E] bg-[#F3EEE3] px-4 py-3 flex items-start gap-2.5 text-[13px] text-[#7D2412]"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#B3371E]" />
              <span>{errorBanner}</span>
            </div>
          )}

          {receipt && (
            <div
              role="status"
              className="border border-[#0F100F] bg-[#F3EEE3] px-4 py-3 flex items-start gap-2.5 text-[13px] text-[#0F100F]"
            >
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#B3371E]" />
              <div>
                <strong>Message received.</strong> Reference{' '}
                <span className="font-mono text-[#B3371E]">{receipt.referenceId}</span> recorded at{' '}
                {receipt.submittedAt}.
              </div>
            </div>
          )}

          <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
            <button
              type="submit"
              disabled={submitting || cooldownSec > 0}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 inline-flex h-[42px] items-center gap-2 border border-[#7D2412] bg-[#B3371E] px-6 text-[13.5px] font-normal text-[#F8F5E8] hover:bg-[#962C17] transition-colors outline-1 outline-[#F8F5E8]/45 -outline-offset-3"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Send size={14} />
              <span>
                {submitting
                  ? 'Dispatching...'
                  : cooldownSec > 0
                    ? `Wait ${cooldownSec}s`
                    : 'Send Inquiry'}
              </span>
            </button>

          </div>
        </form>
      </div>

      {/* Grounded Editorial Colophon */}
      <div className="mt-16 border-t border-[#0F100F] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#434440]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {PROFILE.fullName} · BENGALURU
        </div>

        <a
          href="#home"
          className="inline-flex items-center gap-1.5 border border-[#434440] bg-[#F8F5E8] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:border-[#B3371E] hover:text-[#B3371E] transition-colors"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span>Top of Page</span>
          <ArrowUp size={12} />
        </a>
      </div>
    </footer>
  );
}
