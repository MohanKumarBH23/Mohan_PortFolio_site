import { TIMELINE } from '../../data/profile.js';
import { SectionHeading } from '../common/SectionHeading';

/**
 * Section 06: Experience & Academic Credentials Timeline.
 */
export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto w-full max-w-[1376px] px-5 sm:px-8 lg:px-14 py-14"
    >
      <SectionHeading
        index="03"
        label="Experience & Education"
        title="Experience & Education"
        subtitle="Professional industry engagements and academic milestones"
      />

      <div id="experience-heading" className="sr-only">
        Experience and Education
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column A: Industry Experience */}
        <div className="border border-[#0F100F] bg-[#F8F5E8]">
          <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-5 py-3 flex items-center justify-between">
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              INDUSTRY EXPERIENCE
            </span>
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#B3371E]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >

            </span>
          </div>

          <div className="p-6 space-y-6">
            {TIMELINE.experience.map((item) => (
              <article
                key={`${item.organization}-${item.period}`}
                className="relative border-l border-[#B3371E] pl-5 space-y-3"
              >
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#B3371E]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.period}
                </div>

                <div>
                  <h3
                    className="m-0 text-[22px] font-normal text-[#0F100F]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.role}
                  </h3>
                  <div
                    className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-[#434440] mt-1"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {item.organization}
                  </div>
                </div>

                <ul className="m-0 p-0 list-none space-y-3 pt-1">
                  {item.highlights.map((hl) => (
                    <li
                      key={hl.title}
                      className="border border-[#C5C2B9] bg-[#F3EEE3]/45 p-3.5 text-[14px] leading-[1.6] text-[#434440]"
                    >
                      <strong className="font-medium text-[#0F100F]">{hl.title} </strong>
                      {hl.description}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* Column B: Academic Education */}
        <div className="border border-[#0F100F] bg-[#F8F5E8]">
          <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-5 py-3 flex items-center justify-between">
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ACADEMIC MILESTONES
            </span>
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#5C5B4F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >

            </span>
          </div>

          <div className="divide-y divide-[#C5C2B9]">
            {TIMELINE.education.map((edu) => (
              <article key={`${edu.organization}-${edu.period}`} className="p-6 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#5C5B4F]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {edu.period}
                  </span>
                  <span
                    className="border border-[#B3371E] bg-[#F3EEE3] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#B3371E] tabular-nums"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {edu.grade}
                  </span>
                </div>

                <h3
                  className="m-0 text-[20px] font-normal text-[#0F100F]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {edu.role}
                </h3>

                <div
                  className="text-[14px] font-medium text-[#434440]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {edu.organization}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
