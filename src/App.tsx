import { MotionConfig } from 'motion/react';
import { HeroWorkbench } from './components/hero/HeroWorkbench';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { PublicationsSection } from './components/sections/PublicationsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/modals/ProjectModal';
import { PdfViewerModal } from './components/modals/PdfViewerModal';
import { ToastBanner } from './components/common/ToastBanner';
import { usePortfolioServices } from './hooks/usePortfolioServices';

/**
 * Root Centre-Rail Reference Setting portfolio shell.
 */
export function App() {
  const {
    theme,
    toggleTheme,
    contactService,
    activeSection,
    selectedCategory,
    setSelectedCategory,
    filteredProjects,
    activeProject,
    setActiveProjectId,
    pdfDocument,
    openResumeModal,
    openPdfDocument,
    closePdfDocument,
    toast,
    showToast,
    dismissToast,
    copyChannelValue
  } = usePortfolioServices();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F8F5E8] text-[#0F100F] transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-[#0F100F] focus:bg-[#F8F5E8] focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:text-[#0F100F]"
        >
          Skip to main content
        </a>

        <main id="main-content">
          <HeroWorkbench
            activeSection={activeSection}
            onOpenResume={openResumeModal}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          <AboutSection onOpenResume={openResumeModal} />

          <ExperienceSection />

          <SkillsSection />

          <PublicationsSection
            onOpenPdf={openPdfDocument}
            onInspectArchitecture={(id) => setActiveProjectId(id)}
          />

          <ProjectsSection
            projects={filteredProjects}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProject={(id) => setActiveProjectId(id)}
            onOpenPdf={openPdfDocument}
          />
        </main>

        <ContactSection
          contactService={contactService}
          onCopyChannel={copyChannelValue}
          onShowToast={showToast}
        />

        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProjectId(null)}
          onCopyCode={(code) =>
            copyChannelValue(code, 'Implementation snippet copied to clipboard.')
          }
          onOpenPdf={openPdfDocument}
        />

        <PdfViewerModal
          documentSpec={pdfDocument}
          onClose={closePdfDocument}
        />

        <ToastBanner toast={toast} onDismiss={dismissToast} />
      </div>
    </MotionConfig>
  );
}

export default App;
