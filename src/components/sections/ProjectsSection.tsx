import { FolderGit2, Layers } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import type { ProjectCategory } from '../../hooks/usePortfolioServices';

export interface ProjectsSectionProps {
  projects: readonly any[];
  selectedCategory?: ProjectCategory;
  onSelectCategory?: (cat: ProjectCategory) => void;
  onSelectProject?: (projectId: string) => void;
  onOpenPdf: (doc: {
    url: string;
    title: string;
    downloadName: string;
    badgeLabel?: string;
  }) => void;
}

/**
 * Section 06: Software Systems & Research Engineering Specimens (All 6 Projects).
 */
export function ProjectsSection({
  projects,
  onOpenPdf
}: ProjectsSectionProps) {
  const featured = projects.find((p) => p.featured);
  const secondary = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto w-full max-w-[1376px] px-5 sm:px-8 lg:px-14 py-14"
    >
      <SectionHeading
        index="06"
        label="Projects"
        title="Projects"
        subtitle=""
        rightSlot={
          <a
            href="https://github.com/MohanKumarBH23"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[38px] items-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <FolderGit2 size={14} />
            <span>GitHub ↗</span>
          </a>
        }
      />

      <div id="projects-heading" className="sr-only">
        Indexed Software Systems
      </div>

      {/* Featured System Specimen (when matched by filter) */}
      {featured && (
        <article className="mb-8 border border-[#0F100F] bg-[#F8F5E8]">
          <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-[#B3371E]" />
              <span
                className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#0F100F]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {featured.domainTag}
              </span>
            </div>
            <span
              className="font-mono text-[11px] tabular-nums text-[#B3371E] font-medium"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {featured.cardMeta}
            </span>
          </div>

          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div className="space-y-4">
              <h3
                className="m-0 font-normal tracking-[-0.02em] text-[#0F100F]"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(24px, 2.4vw, 31px)',
                  lineHeight: 1.15
                }}
              >
                {featured.cardTitle}
              </h3>

              <p
                className="m-0 text-[15.5px] leading-[1.65] text-[#434440]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {featured.cardSummary}
              </p>

              <ul className="m-0 p-0 list-none flex flex-wrap gap-2 pt-1">
                {featured.cardTags.map((tag: string) => (
                  <li
                    key={tag}
                    className="border border-[#C5C2B9] bg-[#F3EEE3]/50 px-2.5 py-1 font-mono text-[11px] text-[#0F100F]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                {featured.modal?.pdfUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenPdf({
                        url: featured.modal.pdfUrl,
                        title: featured.modal.title,
                        downloadName: 'Intelli-Eye_IEEE_ICNPCV_2026.pdf',
                        badgeLabel: 'IEEE ICNPCV ’26'
                      })
                    }
                    className="cursor-pointer inline-flex h-[40px] items-center gap-2 border border-[#7D2412] bg-[#B3371E] px-5 text-[13px] font-normal text-[#F8F5E8] hover:bg-[#962C17] transition-colors outline-1 outline-[#F8F5E8]/45 -outline-offset-3"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span>Read IEEE Paper (PDF)</span>
                    <span aria-hidden="true">→</span>
                  </button>
                )}

                {featured.modal?.githubUrl && (
                  <a
                    href={featured.modal.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[40px] items-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <FolderGit2 size={14} />
                    <span>GitHub Archive ↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* Deterministic Pipeline Schematic */}
            {featured.pipelineDiagram && (
              <div className="border border-[#434440] bg-[#F3EEE3]/55 p-5">
                <div className="pb-3 mb-4 border-b border-[#C5C2B9] flex items-center justify-between">
                  <span
                    className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {featured.pipelineDiagram.title}
                  </span>
                  <span
                    className="font-mono text-[11px] font-medium text-[#B3371E]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {featured.pipelineDiagram.telemetry}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {featured.pipelineDiagram.nodes.map((node: any, idx: number) => (
                    <div
                      key={node.step}
                      className={`border px-4 py-3 flex items-center justify-between gap-3 ${node.accent
                        ? 'border-[#B3371E] bg-[#F8F5E8]'
                        : 'border-[#C5C2B9] bg-[#F8F5E8]'
                        }`}
                    >
                      <span
                        className="font-mono text-[12px] font-medium text-[#0F100F]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {node.step}
                      </span>
                      <span
                        className={`font-mono text-[11px] ${node.accent ? 'text-[#B3371E] font-medium' : 'text-[#5C5B4F]'
                          }`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {idx < featured.pipelineDiagram.nodes.length - 1 ? `${node.detail} ↓` : node.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      )}

      {/* Secondary Systems Catalog Grid */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {secondary.map((project, idx) => (
            <article
              key={project.id}
              className="border border-[#434440] bg-[#F8F5E8] flex flex-col justify-between hover:border-[#0F100F] transition-colors"
            >
              <div>
                <div className="border-b border-[#C5C2B9] bg-[#F3EEE3]/65 px-5 py-3 flex items-center justify-between gap-2">
                  <span
                    className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#5C5B4F] truncate"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {project.domainTag}
                  </span>
                  <span
                    className="shrink-0 font-mono text-[10.5px] tabular-nums text-[#0F100F]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3
                    className="m-0 text-[20px] font-normal leading-[1.2] tracking-[-0.015em] text-[#0F100F]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {project.cardTitle}
                  </h3>

                  <p
                    className="m-0 text-[14px] leading-[1.6] text-[#434440]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {project.cardSummary}
                  </p>

                  <ul className="m-0 pt-1 p-0 list-none flex flex-wrap gap-1.5">
                    {project.cardTags.map((tag: string) => (
                      <li
                        key={tag}
                        className="border border-[#C5C2B9] px-2 py-0.5 font-mono text-[10.5px] text-[#434440]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[#C5C2B9] px-5 py-3.5 flex items-center justify-between gap-3 bg-[#F3EEE3]/35">
                <span
                  className="font-mono text-[10.5px] text-[#5C5B4F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {project.cardMeta}
                </span>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.cardTitle} GitHub repository`}
                    className="inline-flex h-[32px] items-center gap-1.5 border border-[#0F100F] bg-[#F8F5E8] px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <FolderGit2 size={13} />
                    <span>GitHub Repo ↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {projects.length === 0 && (
        <div className="border border-[#434440] bg-[#F8F5E8] p-8 text-center">
          <p
            className="m-0 text-[15px] text-[#434440]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            No software systems currently indexed.
          </p>
        </div>
      )}
    </section>
  );
}
