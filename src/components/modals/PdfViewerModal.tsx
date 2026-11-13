import { X, Download, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle';

export interface PdfDocumentSpec {
  url: string;
  title: string;
  downloadName: string;
  badgeLabel?: string;
}

export interface PdfViewerModalProps {
  documentSpec: PdfDocumentSpec | null;
  onClose: () => void;
}

/**
 * Accessible architectural modal viewer for Curriculum Vitae & IEEE Proceeding PDFs.
 */
export function PdfViewerModal({ documentSpec, onClose }: PdfViewerModalProps) {
  useModalLifecycle(Boolean(documentSpec), onClose);

  return (
    <AnimatePresence>
      {documentSpec && (
        <motion.div
          key={documentSpec.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F100F]/75 p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[980px] h-[88vh] flex flex-col border border-[#0F100F] bg-[#F8F5E8] text-[#0F100F]"
          >
            <div className="border-b border-[#0F100F] bg-[#F3EEE3] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {documentSpec.badgeLabel && (
                  <span
                    className="shrink-0 border border-[#B3371E] bg-[#B3371E] px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#F8F5E8]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {documentSpec.badgeLabel}
                  </span>
                )}
                <h3
                  id="pdf-modal-title"
                  className="m-0 truncate text-[18px] font-normal text-[#0F100F]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {documentSpec.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={documentSpec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[34px] items-center gap-1.5 border border-[#434440] bg-[#F8F5E8] px-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0F100F] no-underline hover:border-[#0F100F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <ExternalLink size={12} />
                  <span>New Tab</span>
                </a>
                <a
                  href={documentSpec.url}
                  download={documentSpec.downloadName}
                  className="inline-flex h-[34px] items-center gap-1.5 border border-[#0F100F] bg-[#0F100F] px-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#F8F5E8] no-underline hover:bg-[#B3371E] hover:border-[#B3371E] transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <Download size={12} />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close document preview"
                  className="cursor-pointer inline-flex h-[34px] w-[34px] items-center justify-center border border-[#0F100F] bg-[#F8F5E8] text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#EAE3D2] p-2">
              <iframe
                src={documentSpec.url}
                title={documentSpec.title}
                className="w-full h-full border border-[#434440] bg-white"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
