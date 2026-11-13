import { SKILL_DOMAINS } from '../../data/skills.js';
import { SectionHeading } from '../common/SectionHeading';

/**
 * Section 03: Technical Capability Matrix
 * Full 5-domain technical specification catalog.
 */
export function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="mx-auto w-full max-w-[1376px] px-5 sm:px-8 lg:px-14 py-14"
    >
      <SectionHeading
        index="04"
        label="Technical Skills"
        title="TECHNICAL SKILLS"
        subtitle=""
      />

      <div id="skills-heading" className="sr-only">
        Technical Skills
      </div>

      {/* Technical Domain Specimen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SKILL_DOMAINS.map((domain, index) => {
          const domainNum = index + 1;
          return (
            <article
              key={domain.id}
              className="border border-[#434440] bg-[#F8F5E8] flex flex-col justify-between"
            >
              <div>
                <div className="border-b border-[#C5C2B9] bg-[#F3EEE3]/70 px-5 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-flex h-[24px] min-w-[26px] items-center justify-center border border-[#434440] px-1 text-[12px] font-medium tabular-nums text-[#0F100F]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {String(domainNum).padStart(2, '0')}
                    </span>
                    <h3
                      className="m-0 text-[17.5px] font-normal tracking-[-0.01em] text-[#0F100F]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {domain.title}
                    </h3>
                  </div>
                </div>

                <ul className="m-0 p-5 list-none flex flex-wrap gap-2">
                  {domain.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-[#C5C2B9] bg-[#F8F5E8] px-2.5 py-1 text-[12.5px] text-[#0F100F] hover:border-[#B3371E] hover:text-[#B3371E] transition-colors"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
