import { X, ArrowUpRight, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle';

export interface ProjectModalProps {
  project: any | null;
  onClose: () => void;
  onCopyCode?: (code: string) => void;
  onOpenPdf: (doc: {
    url: string;
    title: string;
    downloadName: string;
    badgeLabel?: string;
  }) => void;
}

/**
 * Architectural deep-dive overlay.
 */
export function ProjectModal({
  project,
  onClose,
  onOpenPdf
}: ProjectModalProps) {
  useModalLifecycle(Boolean(project), onClose);

  const modalData = project?.modal;

  return (
    <AnimatePresence>
      {project && modalData && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F100F]/70 p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[920px] max-h-[90vh] flex flex-col border border-[#0F100F] bg-[#F8F5E8] text-[#0F100F]"
          >
            {/* Header */}
            <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-6 py-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div
                  className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#B3371E]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {modalData.badge}
                </div>
                <h3
                  id="project-modal-title"
                  className="m-0 text-[22px] sm:text-[26px] font-normal leading-[1.15] text-[#0F100F]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {modalData.title}
                </h3>
                <div
                  className="font-mono text-[11px] text-[#434440]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {modalData.category}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="cursor-pointer shrink-0 inline-flex h-[36px] w-[36px] items-center justify-center border border-[#0F100F] bg-[#F8F5E8] text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Architecture Specifications Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="pb-2 border-b border-[#C5C2B9] flex items-center justify-between">
                <span
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F100F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  System Architecture & Engineering Specifications
                </span>
                <span
                  className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#5C5B4F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {modalData.architecture?.length ?? 0} NODES
                </span>
              </div>

              <div className="space-y-3">
                {modalData.architecture?.map((point: string, idx: number) => (
                  <div
                    key={idx}
                    className="border border-[#C5C2B9] bg-[#F3EEE3]/40 p-4 flex items-start gap-3"
                  >
                    <span
                      className="shrink-0 inline-flex h-[24px] min-w-[26px] items-center justify-center border border-[#B3371E] font-mono text-[11px] font-medium text-[#B3371E] tabular-nums"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p
                      className="m-0 text-[14.5px] leading-[1.6] text-[#0F100F]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#0F100F] bg-[#F3EEE3] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {modalData.pdfUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenPdf({
                        url: modalData.pdfUrl,
                        title: modalData.title,
                        downloadName: 'Intelli-Eye_IEEE_ICNPCV_2026.pdf',
                        badgeLabel: 'IEEE ICNPCV ’26'
                      })
                    }
                    className="cursor-pointer inline-flex h-[36px] items-center gap-2 border border-[#7D2412] bg-[#B3371E] px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#F8F5E8] hover:bg-[#962C17] transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <BookOpen size={13} />
                    <span>Open IEEE Paper</span>
                  </button>
                )}

                {modalData.githubUrl && (
                  <a
                    href={modalData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[36px] items-center gap-1.5 border border-[#0F100F] bg-[#F8F5E8] px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span>Source Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer h-[36px] border border-[#434440] bg-transparent px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#434440] hover:border-[#0F100F] hover:text-[#0F100F] transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Close [Esc]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
