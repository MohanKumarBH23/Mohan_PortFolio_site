import { Fragment } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { PUBLICATIONS } from '../../data/publications.js';
import { SectionHeading } from '../common/SectionHeading';
import { SlidingNumber } from '../motion-primitives/sliding-number';

export interface PublicationsSectionProps {
  onOpenPdf: (doc: {
    url: string;
    title: string;
    downloadName: string;
    badgeLabel?: string;
  }) => void;
  onInspectArchitecture?: (projectId: string) => void;
}

const NUMERIC_CALIBRATION = [
  { key: 'system', target: 91.3, suffix: '%', label: 'System mAP@0.5', sub: 'Overall F1: 91.3%' },
  { key: 'weapons', target: 96.3, suffix: '%', label: 'Weapons YOLOv8', sub: '0.984 ROC-AUC' },
  { key: 'fire', target: 92.7, suffix: '%', label: 'Fire & Smoke', sub: '0.967 ROC-AUC' },
  { key: 'theft', target: 86.8, suffix: '%', label: 'Pose Shoplifting', sub: '0.891 ROC-AUC' }
] as const;

/**
 * Section 04: Peer-Reviewed Research & IEEE ICNPCV 2026 Proceedings.
 * Features SlidingNumber benchmark metrics and inline IEEE PDF viewer trigger.
 */
export function PublicationsSection({
  onOpenPdf
}: PublicationsSectionProps) {
  const pub = PUBLICATIONS[0];

  return (
    <section
      id="publications"
      aria-labelledby="publications-heading"
      className="mx-auto w-full max-w-[1376px] px-5 sm:px-8 lg:px-14 py-14"
    >
      <SectionHeading
        index="05"
        label="Publications"
        title="Publications"
      />

      <div id="publications-heading" className="sr-only">
        Peer-Reviewed IEEE Research
      </div>

      <article className="border border-[#0F100F] bg-[#F8F5E8]">
        {/* Proceeding Header Strip */}
        <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {pub.badges.map((badge) => (
              <span
                key={badge.label}
                className={`border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] ${badge.variant === 'ieee'
                  ? 'border-[#B3371E] bg-[#B3371E] text-[#F8F5E8]'
                  : 'border-[#434440] bg-[#F8F5E8] text-[#0F100F]'
                  }`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <span
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#434440]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {pub.presentationDate}
          </span>
        </div>

        {/* Main Proceeding Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.9fr] divide-y lg:divide-y-0 lg:divide-x divide-[#434440]">
          {/* Left: Title, Venue, Abstract & Actions */}
          <div className="p-6 lg:p-8 space-y-5">
            <h3
              className="m-0 font-normal tracking-[-0.02em] text-[#0F100F]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(24px, 2.5vw, 32px)',
                lineHeight: 1.15
              }}
            >
              {pub.title}
            </h3>

            <div className="border-l border-[#B3371E] pl-4 space-y-1">
              <div
                className="text-[14px] font-medium text-[#0F100F]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {pub.venue.conference}
              </div>
              <div
                className="font-mono text-[11px] text-[#5C5B4F]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {pub.venue.metadata}
              </div>
            </div>

            <p
              className="m-0 text-justify text-[15.5px] leading-[1.68] text-[#434440]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {pub.abstractSegments.map((seg, idx) =>
                seg.strong ? (
                  <strong key={idx} className="font-medium text-[#0F100F]">
                    {seg.text}
                  </strong>
                ) : (
                  <Fragment key={idx}>{seg.text}</Fragment>
                )
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onOpenPdf(pub.pdf)}
                className="cursor-pointer inline-flex h-[40px] items-center gap-2 border border-[#7D2412] bg-[#B3371E] px-5 text-[13px] font-normal tracking-[0.02em] text-[#F8F5E8] hover:bg-[#962C17] transition-colors outline-1 outline-[#F8F5E8]/45 -outline-offset-3"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <BookOpen size={15} />
                <span>Read IEEE Paper (PDF)</span>
              </button>

              <a
                href={pub.pdf.url}
                download={pub.pdf.downloadName}
                className="inline-flex h-[40px] items-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Right: Empirical Calibration Matrix (Motion Primitives SlidingNumber) */}
          <div
            data-region="calibration-matrix"
            className="p-6 lg:p-8 bg-transparent flex flex-col justify-between"
          >
            <div>
              <div className="pb-3 mb-4 border-b border-[#0F100F] flex items-center justify-between">
                <span
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  EMPIRICAL CALIBRATION
                </span>
                <span
                  className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#B3371E]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  14.2ms / FRAME
                </span>
              </div>

              <div className="divide-y divide-[#C5C2B9]">
                {NUMERIC_CALIBRATION.map((metric) => (
                  <div
                    key={metric.key}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div
                        className="text-[14px] font-medium text-[#0F100F]"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {metric.label}
                      </div>
                      <div
                        className="font-mono text-[10.5px] text-[#5C5B4F]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {metric.sub}
                      </div>
                    </div>

                    <div
                      className="flex items-baseline font-serif text-[28px] font-medium leading-none tabular-nums text-[#B3371E]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <SlidingNumber value={metric.target} />
                      <span className="text-[18px] ml-0.5">{metric.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#C5C2B9] flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#5C5B4F]">

            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
