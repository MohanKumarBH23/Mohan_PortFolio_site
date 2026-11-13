import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS, PROFILE } from '../../data/profile.js';
import { TextEffect } from '../motion-primitives/text-effect';
import { TextMorph } from '../motion-primitives/text-morph';

export interface HeroWorkbenchProps {
  onOpenResume?: () => void;
  activeSection?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const RAIL_LETTERS = ['M', 'O', 'H', 'A', 'N'] as const;

const ROLE_TITLES = [
  'ML Explorer',
  'Coder',
  'Aspirant',
] as const;

/**
 * First-viewport Centre-Rail Reference Setting workbench with interactive Motion Primitives hero greeting & role morphing.
 */
export function HeroWorkbench({
  onOpenResume,
  activeSection = 'home',
  theme = 'light',
  onToggleTheme
}: HeroWorkbenchProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLE_TITLES.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      aria-label="Engineering Overview Workbench"
      className="relative mx-auto w-full max-w-[1376px] bg-[#F8F5E8] text-[#0F100F] flex flex-col pb-6 sm:pb-8 lg:pb-12"
    >
      {/* Top Masthead Bar */}
      <header className="w-full border-b border-[#0F100F] px-5 sm:px-8 lg:px-14 py-4 flex flex-wrap items-center justify-between gap-4">
        <div data-region="masthead-brand" className="flex items-center gap-3">
          <svg
            width="22"
            height="28"
            viewBox="0 0 24 32"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-[#434440]"
          >
            <circle cx="9" cy="10" r="4.5" stroke="currentColor" strokeWidth="1" />
            <line x1="9" y1="1" x2="9" y2="19" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="10" r="1.2" fill="#B3371E" />
            <path d="M9 22V28M6 25H12" stroke="#B3371E" strokeWidth="1" />
          </svg>
          <a
            href="#home"
            className="text-[12px] font-medium tracking-[0.12em] uppercase text-[#0F100F] no-underline hover:text-[#B3371E] transition-colors"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {PROFILE.fullName}
          </a>
        </div>

        <nav data-region="masthead-nav" aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 m-0 p-0 list-none">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`inline-flex items-baseline gap-1 text-[12px] leading-none tracking-[0.01em] no-underline transition-colors ${isActive
                      ? 'text-[#B3371E] font-medium'
                      : 'text-[#0F100F] hover:text-[#B3371E]'
                      }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span
                      className="tabular-nums text-[10.5px] text-[#5C5B4F]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div data-region="masthead-resume" className="flex items-center gap-2 sm:gap-2.5">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="cursor-pointer inline-flex h-[36px] items-center justify-center gap-1.5 border border-[#0F100F] bg-[#F8F5E8] px-2.5 sm:px-3 text-[11px] font-mono tracking-[0.08em] uppercase text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={13} className="text-[#A3E635]" aria-hidden="true" />
                  <span className="hidden sm:inline">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-[#434440]" aria-hidden="true" />
                  <span className="hidden sm:inline">DARK</span>
                </>
              )}
            </button>
          )}

          {onOpenResume ? (
            <button
              type="button"
              onClick={onOpenResume}
              className="cursor-pointer inline-flex h-[36px] items-center justify-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-3.5 md:px-4 text-[11px] md:text-[12px] font-medium tracking-[0.08em] uppercase text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span>RESUME PDF</span>
              <span aria-hidden="true" className="text-[15px] leading-none font-light">+</span>
            </button>
          ) : (
            <a
              href={PROFILE.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[36px] items-center justify-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-3.5 md:px-4 text-[11px] md:text-[12px] font-medium tracking-[0.08em] uppercase text-[#0F100F] no-underline hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span>RESUME PDF</span>
              <span aria-hidden="true" className="text-[15px] leading-none font-light">+</span>
            </a>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden cursor-pointer inline-flex h-[36px] w-[36px] items-center justify-center border border-[#0F100F] bg-[#F8F5E8] text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Section Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile section navigation"
            className="md:hidden w-full border-t border-[#C5C2B9] pt-3 mt-1"
          >
            <ul className="grid grid-cols-2 gap-2 m-0 p-0 list-none">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 border px-3 py-2 text-[12px] no-underline transition-colors ${isActive
                        ? 'border-[#B3371E] bg-[#F3EEE3] text-[#B3371E] font-medium'
                        : 'border-[#C5C2B9] bg-[#F8F5E8] text-[#0F100F]'
                        }`}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      <span
                        className="tabular-nums text-[10.5px] text-[#5C5B4F]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {item.num}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {onToggleTheme && (
              <div className="pt-2.5 mt-2.5 border-t border-[#C5C2B9]">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="cursor-pointer inline-flex h-[36px] w-full items-center justify-center gap-2 border border-[#0F100F] bg-[#F8F5E8] px-3 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-[#0F100F] hover:bg-[#0F100F] hover:text-[#F8F5E8] transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={14} className="text-[#A3E635]" />
                      <span>Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={14} className="text-[#434440]" />
                      <span>Switch to Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </nav>
        )}
      </header>

      {/* Main Split Workbench with Fixed Central M O H A N Index Rail */}
      <div className="relative mx-auto w-full px-5 sm:px-8 lg:px-14 py-8 grid grid-cols-1 lg:grid-cols-[1fr_56px_0.82fr] gap-6 items-center flex-1">
        {/* Left Column: Hi, I am MOHAN + Motion Effects + Credentials + Actions */}
        <div className="flex flex-col items-start gap-5">
          <div
            data-region="availability-badge"
            className="inline-flex items-center gap-2.5 border border-[#434440] bg-[#F8F5E8] px-3.5 py-1.5"
          >
            <span className="h-[6px] w-[6px] bg-[#B3371E]" aria-hidden="true" />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {PROFILE.availability}
            </span>
          </div>

          <div data-region="hero-headline" className="space-y-2">
            <TextEffect
              per="char"
              preset="fade"
              className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-[#B3371E]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              HI, I AM
            </TextEffect>

            <h1
              className="m-0 font-normal tracking-[-0.025em] text-[#0F100F]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(40px, 4.3vw, 60px)',
                lineHeight: 1.03
              }}
            >
              <TextEffect per="char" preset="fade-in-blur" as="span">
                {PROFILE.fullName}
              </TextEffect>
            </h1>

            <div className="flex items-baseline gap-2.5 pt-1 min-h-[30px]">
              <span
                className="font-mono text-[13px] text-[#5C5B4F] shrink-0"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-hidden="true"
              >
                //
              </span>
              <TextMorph
                as="p"
                className="m-0 text-[18.5px] sm:text-[20px] font-normal tracking-[-0.01em] text-[#434440]"
                style={{ fontFamily: 'var(--font-lead)' }}
              >
                {ROLE_TITLES[roleIndex]}
              </TextMorph>
            </div>
          </div>

          <p
            data-region="hero-lead"
            className="m-0 max-w-[54ch] text-[17.5px] font-light leading-[1.52] text-[#434440]"
            style={{ fontFamily: 'var(--font-lead)' }}
          >
            {PROFILE.heroLead}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
            {PROFILE.credentials.map((cred) => (
              <div
                key={cred.label}
                className="border-l border-[#B3371E] pl-3 py-0.5 bg-[#F3EEE3]/50"
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5B4F]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {cred.label}
                </div>
                <div
                  className="text-[12.5px] font-medium text-[#0F100F] mt-0.5"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {cred.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a
              data-region="hero-cta-secondary"
              href="#contact"
              className="inline-flex items-center gap-2 border-b border-[#0F100F] pb-1 text-[15px] font-normal text-[#0F100F] no-underline hover:border-[#B3371E] hover:text-[#B3371E] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span>Contact</span>
              <span aria-hidden="true">+</span>
            </a>
          </div>
        </div>

        {/* Center Spine: Vertical M O H A N Index Rail */}
        <aside
          data-region="centre-rail"
          aria-label="Center Index Rail"
          className="hidden lg:flex h-[390px] flex-col items-center justify-between py-1"
        >
          <span className="h-[6px] w-[6px] bg-[#B3371E]" aria-hidden="true" />
          <div className="relative flex flex-1 flex-col items-center justify-evenly py-3 w-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-[#C5C2B9]"
            />
            {RAIL_LETTERS.map((letter, idx) => (
              <div
                key={letter}
                className="relative z-10 flex flex-col items-center gap-2 bg-[#F8F5E8] py-1"
              >
                <span
                  className="font-mono text-[10.5px] font-semibold leading-none tracking-[0.06em] text-[#434440]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {letter}
                </span>
                {idx < RAIL_LETTERS.length - 1 && (
                  <span
                    className="h-[4px] w-[4px] border border-[#B3371E] bg-[#F8F5E8]"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <span className="h-[6px] w-[6px] bg-[#B3371E]" aria-hidden="true" />
        </aside>

        {/* Right Column: Studio Portrait Specimen Frame */}
        <div className="flex flex-col items-center lg:items-end justify-center">
          <figure
            data-region="portrait-plate"
            className="m-0 w-full max-w-[330px] border border-[#0F100F] bg-[#F8F5E8] p-2"
          >
            <div className="border border-[#5C5B4F] bg-[#F8F5E8] aspect-square overflow-hidden">
              <img
                src="./assets/plates/portrait-plate.png"
                alt="Portrait of Mohan Kumar B.H"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <figcaption
              className="mt-2 pt-2 border-t border-[#C5C2B9] flex items-center justify-center font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#0F100F]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span>MOHAN</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
