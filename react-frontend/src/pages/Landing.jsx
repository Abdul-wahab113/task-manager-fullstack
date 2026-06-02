import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  LayoutGrid,
  Type,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Calendar,
  Menu,
  X,
  Star,
  Sparkles,
} from 'lucide-react';
import '../styles/landing.css';

/* GitHub brand mark — lucide v1 dropped brand icons, so inline it (no emoji). */
function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.71.08-.71 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.81 0-1.28.47-2.33 1.24-3.15-.12-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.29-1.52 3.3-1.2 3.3-1.2.66 1.64.24 2.85.12 3.15.77.82 1.24 1.87 1.24 3.15 0 4.51-2.81 5.5-5.49 5.79.43.36.81 1.09.81 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.83.56A12.04 12.04 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

/* Small mark used in the navbar + footer */
function LogoMark() {
  return (
    <span className="tlp-logo-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M9.5 16.5l4.2 4.2L22.5 11.5"
          stroke="#fff"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* Adds .is-visible to children as they scroll into view */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.tlp-reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FEATURES = [
  {
    icon: LayoutGrid,
    title: 'Drag-and-drop Kanban',
    desc: 'Move tasks across To Do, In Progress, and Done with a smooth, tactile drag. Your board updates instantly — no save button, no friction.',
  },
  {
    icon: Type,
    title: 'Rich text descriptions',
    desc: 'Capture the full picture with bold, italics, lists, and links. Every task holds the context it needs, formatted exactly how you want it.',
  },
  {
    icon: BarChart3,
    title: 'Productivity analytics',
    desc: 'A live completion bar and per-status breakdown show momentum at a glance, so you always know what is done and what is left.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    desc: 'JWT auth with HttpOnly cookies, rate limiting, and strict CORS. Your tasks stay private and your session stays protected.',
  },
];

const STEPS = [
  {
    title: 'Create a task',
    desc: 'Add a title, a rich description, a priority, and a due date in one clean panel. It lands in To Do, ready to go.',
  },
  {
    title: 'Organize your board',
    desc: 'Drag tasks between columns as work moves forward. Priority pills and due dates keep the important things visible.',
  },
  {
    title: 'Track your progress',
    desc: 'Watch your completion percentage climb in real time and clear your board with confidence.',
  },
];

export default function Landing() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="tlp">
      {/* ---------- Navbar ---------- */}
      <header
        ref={navRef}
        className={`tlp-nav${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}
      >
        <div className="tlp-container tlp-nav-inner">
          <Link to="/" className="tlp-logo" onClick={closeMenu}>
            <LogoMark />
            Tasker
          </Link>

          <nav className="tlp-nav-links">
            <a href="#features" className="tlp-nav-link" onClick={closeMenu}>
              Features
            </a>
            <a href="#how" className="tlp-nav-link" onClick={closeMenu}>
              How it works
            </a>
            <a
              href="https://github.com/Abdul-wahab113/task-manager-fullstack"
              target="_blank"
              rel="noreferrer"
              className="tlp-nav-link"
              onClick={closeMenu}
            >
              GitHub
            </a>
          </nav>

          <div className="tlp-nav-actions">
            {user ? (
              <Link to="/app" className="tlp-btn tlp-btn-primary">
                Open app <ArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/login" className="tlp-btn tlp-btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="tlp-btn tlp-btn-primary">
                  Get started
                </Link>
              </>
            )}
            <button
              className="tlp-nav-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="tlp-hero">
          <div className="tlp-hero-bg" />
          <div className="tlp-container tlp-hero-inner">
            <span className="tlp-badge">
              <span className="tlp-badge-tag">New</span>
              Kanban, rich text &amp; analytics in one place
            </span>

            <h1>
              The calm way to <span className="tlp-hl">organize your work</span>
            </h1>
            <p className="tlp-hero-sub">
              Tasker is a clean, fast task manager built around a drag-and-drop Kanban
              board. Plan, prioritize, and track everything you are working on — without
              the clutter.
            </p>

            <div className="tlp-hero-cta">
              <Link
                to={user ? '/app' : '/register'}
                className="tlp-btn tlp-btn-primary tlp-btn-lg"
              >
                {user ? 'Open app' : 'Get started'} <ArrowRight />
              </Link>
              <a href="#preview" className="tlp-btn tlp-btn-secondary tlp-btn-lg">
                View demo
              </a>
            </div>

            <div className="tlp-hero-note">
              <Check /> Free to use · No credit card required
            </div>
          </div>

          {/* Stylized product preview */}
          <div id="preview" className="tlp-preview tlp-container tlp-reveal">
            <div className="tlp-preview-frame">
              <div className="tlp-preview-bar">
                <span className="tlp-dot" />
                <span className="tlp-dot" />
                <span className="tlp-dot" />
                <span className="tlp-preview-title">tasker — my board</span>
              </div>
              <BoardPreview />
            </div>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" className="tlp-section">
          <div className="tlp-container">
            <div className="tlp-section-head tlp-reveal">
              <span className="tlp-eyebrow">Features</span>
              <h2>Everything you need to stay on track</h2>
              <p>
                A focused set of tools that work together — no bloat, no learning curve,
                just a board that gets out of your way.
              </p>
            </div>

            <div className="tlp-features">
              {FEATURES.map((f, i) => (
                <article
                  key={f.title}
                  className="tlp-feature tlp-reveal"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <span className="tlp-feature-icon">
                    <f.icon />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how" className="tlp-section tlp-howto">
          <div className="tlp-container">
            <div className="tlp-section-head tlp-reveal">
              <span className="tlp-eyebrow">How it works</span>
              <h2>From idea to done in three steps</h2>
              <p>Tasker keeps the workflow simple so you can spend time doing, not managing.</p>
            </div>

            <div className="tlp-steps">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="tlp-step tlp-reveal"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="tlp-step-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA band ---------- */}
        <section className="tlp-cta">
          <div className="tlp-container">
            <div className="tlp-cta-card tlp-reveal">
              <div className="tlp-cta-grid" />
              <h2>Ready to clear your board?</h2>
              <p>
                Start organizing your tasks in minutes. Tasker is free, fast, and built for
                people who like things tidy.
              </p>
              <div className="tlp-cta-actions">
                <Link
                  to={user ? '/app' : '/register'}
                  className="tlp-btn tlp-btn-primary tlp-btn-lg"
                >
                  {user ? 'Open app' : 'Get started free'} <ArrowRight />
                </Link>
                <a
                  href="https://github.com/Abdul-wahab113/task-manager-fullstack"
                  target="_blank"
                  rel="noreferrer"
                  className="tlp-btn tlp-btn-secondary tlp-btn-lg"
                >
                  <Star size={16} /> Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="tlp-footer">
        <div className="tlp-container">
          <div className="tlp-footer-top">
            <div className="tlp-footer-brand">
              <Link to="/" className="tlp-logo">
                <LogoMark />
                Tasker
              </Link>
              <p>
                A modern full-stack task manager with a drag-and-drop Kanban board, rich
                text, and productivity analytics.
              </p>
            </div>

            <div className="tlp-footer-cols">
              <div className="tlp-footer-col">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how">How it works</a>
                <a href="#preview">Demo</a>
              </div>
              <div className="tlp-footer-col">
                <h4>Account</h4>
                <Link to="/login">Sign in</Link>
                <Link to="/register">Create account</Link>
                {user && <Link to="/app">Open app</Link>}
              </div>
              <div className="tlp-footer-col">
                <h4>Resources</h4>
                <a
                  href="https://github.com/Abdul-wahab113/task-manager-fullstack"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://github.com/Abdul-wahab113/task-manager-fullstack#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentation
                </a>
              </div>
            </div>
          </div>

          <div className="tlp-footer-bottom">
            <span>© {new Date().getFullYear()} Tasker. Built by Abdul Wahab.</span>
            <div className="tlp-footer-socials">
              <a
                href="https://github.com/Abdul-wahab113/task-manager-fullstack"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a href="#preview" aria-label="Demo">
                <Sparkles />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Stylized Kanban board (presentational only) ---------- */
function BoardPreview() {
  const columns = [
    {
      name: 'To Do',
      color: '#2563eb',
      cards: [
        { p: 'high', t: 'Design new onboarding flow', d: 'Jun 12', a: 'AW' },
        { p: 'low', t: 'Collect user feedback notes', d: 'Jun 15', a: 'AW' },
      ],
    },
    {
      name: 'In Progress',
      color: '#d97706',
      cards: [
        { p: 'medium', t: 'Build analytics dashboard', d: 'Jun 09', a: 'AW' },
        { p: 'high', t: 'Refactor auth middleware', d: 'Jun 10', a: 'AW' },
      ],
    },
    {
      name: 'Done',
      color: '#16a34a',
      cards: [
        { p: 'medium', t: 'Set up CI/CD pipeline', d: 'Jun 04', a: 'AW' },
        { p: 'low', t: 'Write project README', d: 'Jun 02', a: 'AW' },
      ],
    },
  ];

  return (
    <div className="tlp-board">
      {columns.map((col) => (
        <div key={col.name}>
          <div className="tlp-col-head">
            <span className="tlp-col-name">
              <span className="tlp-col-tick" style={{ background: col.color }} />
              {col.name}
            </span>
            <span className="tlp-col-count">{col.cards.length}</span>
          </div>
          {col.cards.map((c) => (
            <div className="tlp-card" key={c.t}>
              <span className={`tlp-pill ${c.p}`}>{c.p}</span>
              <div className="tlp-card-title">{c.t}</div>
              <div className="tlp-card-foot">
                <span className="tlp-card-date">
                  <Calendar /> {c.d}
                </span>
                <span className="tlp-avatar">{c.a}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
