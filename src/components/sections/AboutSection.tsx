import React from 'react';
import { FileText, Download } from 'lucide-react';
import { PROFILE } from '../../data/profile.js';
import { SectionHeading } from '../common/SectionHeading';

export interface AboutSectionProps {
  onOpenResume: () => void;
}

/**
 * Section 02: Engineering Narrative & Academic Specification Ledger.
 */
export function AboutSection({ onOpenResume }: AboutSectionProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto w-full max-w-[1376px] px-5 sm:px-8 lg:px-14 py-14"
    >
      <SectionHeading
        index="02"
        label="About Me"
        title="ABOUT ME"
        subtitle=""
        rightSlot={
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenResume}
              className="cursor-pointer inline-flex h-[38px] items-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <FileText size={14} />
              <span>Preview Resume</span>
            </button>
            <a
              href={PROFILE.resume.url}
              download={PROFILE.resume.downloadName}
              className="inline-flex h-[38px] items-center gap-2 border border-[#434440] bg-[#F3EEE3] px-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:border-[#B3371E] hover:text-[#B3371E] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <Download size={14} />
              <span>PDF</span>
            </a>
          </div>
        }
      />

      <div id="about-heading" className="sr-only">
        About Mohan Kumar B.H
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.95fr] gap-10 items-start">
        {/* Left: Editorial Prose */}
        <div className="space-y-5 max-w-[68ch]">
          {PROFILE.aboutParagraphs.map((segments, pIdx) => (
            <p
              key={pIdx}
              className={`m-0 text-justify text-[16.5px] leading-[1.68] text-[#434440] ${
                pIdx < PROFILE.aboutParagraphs.length - 1 ? 'pb-4' : ''
              }`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {segments.map((seg, sIdx) =>
                seg.strong ? (
                  <strong key={sIdx} className="font-medium text-[#0F100F]">
                    {seg.text}
                  </strong>
                ) : (
                  <React.Fragment key={sIdx}>{seg.text}</React.Fragment>
                )
              )}
            </p>
          ))}
        </div>

        {/* Right: Archival Profile & Academic Specification Table */}
        <aside
          aria-label="Profile and Academic Ledger"
          className="border border-[#0F100F] bg-[#F8F5E8]"
        >
          <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-5 py-3 flex items-center justify-between">
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              CREDENTIALS
            </span>
          </div>

          <dl className="m-0 divide-y divide-[#C5C2B9]">
            {PROFILE.ledger.map((row) => (
              <div
                key={row.label}
                className="px-5 py-3.5 flex items-baseline justify-between gap-4"
              >
                <dt
                  className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-[#5C5B4F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {row.label}
                </dt>
                <dd
                  className="m-0 text-right text-[14px] font-medium text-[#0F100F] tabular-nums"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-[#434440] bg-[#F3EEE3]/65 px-5 py-3.5 flex items-center justify-between gap-3">
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#434440]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              STATUS · FULL-TIME AI / ML / SDE
            </span>
            <a
              href="#contact"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#B3371E] no-underline hover:underline"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              INQUIRE →
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
