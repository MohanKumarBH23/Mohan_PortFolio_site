import React from 'react';

export interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

/**
 * Shared ruled editorial header for each folio section (02–07),
 * integrating inline section index numbering without stacked eyebrow kickers.
 */
export function SectionHeading({ index, label, title, subtitle, rightSlot }: SectionHeadingProps) {
  return (
    <div className="border-t border-[#0F100F] pt-6 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="space-y-2.5 max-w-[68ch]">
        <h2
          className="m-0 font-normal tracking-[-0.02em] text-[#0F100F] flex items-baseline gap-3"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 3vw, 40px)',
            lineHeight: 1.08
          }}
        >
          <span
            aria-label={`${index} ${label}`}
            className="tabular-nums font-mono text-[14px] font-medium tracking-[0.06em] text-[#B3371E] shrink-0"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {index}
          </span>
          <span>{title}</span>
        </h2>

        {subtitle && (
          <p
            className="m-0 text-[15.5px] font-light leading-[1.5] text-[#434440]"
            style={{ fontFamily: 'var(--font-lead)' }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}
