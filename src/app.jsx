import React from "react";
import avatarImg from "./assets/avatar.png";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRadio,
  TweakColor,
  TweakToggle,
  TweakSelect,
  TweakButton,
} from "./tweaks-panel";
import {
  springs,
  AnimatedText,
  Tilt3D,
  useMagneticEffect,
  ShimmerOverlay,
  staggerContainer,
  fadeUp,
} from "./animations.jsx";

// ── Defaults & Fonts ───────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  accent: "#d97706",
  theme: "dark",
  grain: true,
  scanline: false,
  fontDisplay: "Space Grotesk",
  showStatus: true,
  density: "regular",
}/*EDITMODE-END*/;

const FONT_OPTIONS = {
  "Space Grotesk": "'Space Grotesk', system-ui, sans-serif",
  Archivo: "'Archivo', system-ui, sans-serif",
  "Bricolage Grotesque": "'Bricolage Grotesque', system-ui, sans-serif",
  Syne: "'Syne', system-ui, sans-serif",
};

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = {
  whatsapp: (c) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={c} strokeWidth="1.6">
      <path d="M3 21l1.7-5.1A8.5 8.5 0 1 1 8.1 19.3L3 21z" strokeLinejoin="round" />
      <path d="M8.5 9c.2 1.4.9 2.7 2 3.7 1 1 2.3 1.7 3.6 1.9.5.1 1-.1 1.3-.5l.5-.7c.2-.3.1-.6-.2-.8l-1.4-.8c-.3-.2-.6-.1-.8.1l-.4.4c-.2.2-.4.2-.6.1-.7-.3-1.3-.8-1.7-1.5-.1-.2-.1-.4.1-.6l.4-.4c.2-.2.2-.5.1-.8L9.6 7.5c-.2-.3-.5-.4-.8-.2l-.7.5c-.4.3-.6.8-.5 1.3z" fill={c} stroke="none" />
    </svg>
  ),
  instagram: (c) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={c} strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r=".9" fill={c} />
    </svg>
  ),
  globe: (c) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={c} strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.8 5.5 3.8 8.5s-1.3 5.9-3.8 8.5M12 3.5c-2.5 2.6-3.8 5.5-3.8 8.5s1.3 5.9 3.8 8.5" />
    </svg>
  ),
  arrow: (c) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),
  soon: (c) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={c} strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

// ── Link data ──────────────────────────────────────────────────────────────
const LINKS = [
  { id: "whatsapp", title: "Fale comigo", sub: "WhatsApp · resposta direta", handle: "+55 62 98229-1074", href: "https://wa.me/5562982291074", icon: "whatsapp", tag: "primary" },
  { id: "instagram", title: "Instagram", sub: "bastidores, tutoriais, projetos", handle: "@clebercardoso.ia", href: "https://instagram.com/clebercardoso.ai", icon: "instagram" },
  { id: "site", title: "Site oficial", sub: "em construção · em breve", handle: "clebercardoso.ia", href: "#", icon: "globe", soon: true },
];

// ── Custom cursor with spring physics ──────────────────────────────────────
function CustomCursor({ accent, theme }) {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const target = React.useRef({ x: -100, y: -100 });
  const current = React.useRef({ x: -100, y: -100 });

  React.useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      const t = e.target;
      setHover(!!(t && t.closest && t.closest('[data-cursor="link"]')));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      setPos({ x: current.current.x, y: current.current.y });
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(id);
    };
  }, []);

  if (typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches) return null;

  const dotColor = theme === "dark" ? "#fff" : "#111";
  const scale = hover ? 1.6 : down ? 0.7 : 1;

  return (
    <>
      <motion.div
        className="cur-ring"
        style={{ borderColor: accent, x: pos.x, y: pos.y }}
        animate={{ scale, opacity: hover ? 0.95 : 0.55 }}
        transition={springs.stiff}
      />
      <motion.div
        className="cur-dot"
        style={{ background: hover ? accent : dotColor, x: target.current.x, y: target.current.y }}
        animate={{ scale: down ? 0.5 : 1 }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}

// ── Boot sequence ──────────────────────────────────────────────────────────
function useBootText(text, speed = 18) {
  const [out, setOut] = React.useState("");
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

// ── Click counter ──────────────────────────────────────────────────────────
function useClickCounts() {
  const KEY = "cleber_link_clicks_v1";
  const [counts, setCounts] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  });
  const bump = (id) => {
    setCounts((c) => {
      const next = { ...c, [id]: (c[id] || 0) + 1 };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return [counts, bump, total];
}

// ── Animated card with 3D tilt + shimmer ───────────────────────────────────
function LinkCard({ item, index, accent, count, onClick, density }) {
  const padY = density === "compact" ? 14 : density === "comfy" ? 22 : 18;
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      style={{ "--accent": accent }}
    >
      <Tilt3D strength={6}>
        <motion.a
          href={item.href}
          target={item.href === "#" ? undefined : "_blank"}
          rel="noreferrer"
          data-cursor="link"
          className={`card ${item.soon ? "card-soon" : ""}`}
          style={{ padding: `${padY}px 18px` }}
          onClick={(e) => { if (item.soon) e.preventDefault(); onClick(item.id); }}
          onMouseMove={handleMouseMove}
          whileHover={{ y: -3, borderColor: "var(--card-border-hover)" }}
          transition={springs.gentle}
        >
          <ShimmerOverlay mouseX={mousePos.x} mouseY={mousePos.y} accent={accent} />
          <div className="card-grid-overlay" aria-hidden="true" />
          <div className="card-inner">
            <motion.div
              className="card-icon"
              whileHover={{ rotate: -8, scale: 1.1 }}
              transition={springs.bouncy}
            >
              {Icon[item.icon](accent)}
            </motion.div>
            <div className="card-body">
              <div className="card-title-row">
                <span className="card-title">{item.title}</span>
                {item.tag === "primary" && (
                  <motion.span
                    className="card-pill"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, ...springs.bouncy }}
                  >
                    recomendado
                  </motion.span>
                )}
                {item.soon && <span className="card-pill card-pill-muted">em breve</span>}
              </div>
              <div className="card-sub">{item.sub}</div>
            </div>
            <div className="card-meta">
              <span className="card-count" title="cliques">
                <span className="card-count-bar"><i style={{ background: accent }} /></span>
                {String(count || 0).padStart(3, "0")}
              </span>
              <motion.span
                className="card-arrow"
                whileHover={{ x: 3, y: -3, borderColor: accent }}
                transition={springs.snappy}
              >
                {Icon.arrow(accent)}
              </motion.span>
            </div>
          </div>
          <div className="card-handle">
            <span className="dim">↳</span> {item.handle}
          </div>
        </motion.a>
      </Tilt3D>
    </motion.div>
  );
}

// ── Animated avatar with glow ──────────────────────────────────────────────
function AnimatedAvatar({ accent }) {
  const glowScale = useMotionValue(1);
  const springGlow = useSpring(glowScale, { ...springs.slow, stiffness: 40 });

  React.useEffect(() => {
    const id = setInterval(() => {
      glowScale.set(glowScale.get() > 1.05 ? 0.95 : 1.12);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="avatar"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, ...springs.bouncy }}
    >
      <motion.div
        className="avatar-glow"
        style={{
          scale: springGlow,
          background: `radial-gradient(circle, ${accent}8a 0%, transparent 65%)`,
        }}
      />
      <Tilt3D strength={10} style={{ width: "100%", height: "100%" }}>
        <div className="avatar-frame">
          <img src={avatarImg} alt="Cleber Cardoso" />
        </div>
      </Tilt3D>
      <div className="avatar-corners">
        <i /><i /><i /><i />
      </div>
    </motion.div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [counts, bump, total] = useClickCounts();
  const [now, setNow] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const isDark = t.theme === "dark";
  const fontFamily = FONT_OPTIONS[t.fontDisplay] || FONT_OPTIONS["Space Grotesk"];
  const intro = useBootText("init shell · loading profile · ok", 22);

  const rootStyle = {
    "--accent": t.accent,
    "--font-display": fontFamily,
    "--bg": isDark ? "#0b0b0c" : "#f4f1ea",
    "--bg-soft": isDark ? "#101012" : "#ebe6dc",
    "--fg": isDark ? "#e9e5dc" : "#1a1814",
    "--fg-dim": isDark ? "rgba(233,229,220,.55)" : "rgba(26,24,20,.55)",
    "--fg-faint": isDark ? "rgba(233,229,220,.18)" : "rgba(26,24,20,.18)",
    "--card-bg": isDark ? "rgba(255,255,255,.025)" : "rgba(0,0,0,.02)",
    "--card-bg-hover": isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)",
    "--card-border": isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
    "--card-border-hover": isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.18)",
  };

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <motion.div
      className={`root ${isDark ? "dark" : "light"}`}
      style={rootStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background layers */}
      <div className="bg-base" />
      {t.grain && <div className="bg-grain" aria-hidden="true" />}
      <div className="bg-vignette" aria-hidden="true" />
      {t.scanline && <div className="bg-scan" aria-hidden="true" />}

      <CustomCursor accent={t.accent} theme={t.theme} />

      {/* Top chrome */}
      <motion.header
        className="topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...springs.gentle }}
      >
        <div className="topbar-l mono">
          <span className="dot-live" />
          <span>clebercardoso.ia</span>
          <span className="dim sep">/</span>
          <span className="dim">{time}</span>
        </div>
        <div className="topbar-r">
          <motion.button
            className="theme-toggle mono"
            onClick={() => setTweak("theme", isDark ? "light" : "dark")}
            data-cursor="link"
            aria-label="alternar tema"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
          >
            <motion.span
              className="theme-toggle-knob"
              layout
              transition={springs.bouncy}
            />
            <span className="theme-toggle-label">{isDark ? "DARK" : "LIGHT"}</span>
          </motion.button>
          <motion.span
            className="badge mono"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, ...springs.bouncy }}
          >
            IA & NEGÓCIOS
          </motion.span>
        </div>
      </motion.header>

      {/* Main */}
      <main className="main">
        {/* Boot line */}
        <motion.div
          className="boot mono"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, ...springs.gentle }}
        >
          <span className="prompt">$</span> {intro}<span className="caret">█</span>
        </motion.div>

        {/* Hero */}
        <section className="hero">
          <AnimatedAvatar accent={t.accent} />

          <div className="id-block">
            <motion.div
              className="id-meta mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...springs.gentle }}
            >
              <span>id:</span>
              <span className="dim">cleber-cardoso · BR · v.2026</span>
            </motion.div>

            <h1 className="name">
              <span className="name-line">
                <AnimatedText text="Cleber" delay={0.5} className="name-line" />
              </span>
              <span className="name-line name-line-accent">
                <AnimatedText text="Cardoso" delay={0.7} className="name-line-accent" />
                <span className="name-dot">.</span>
              </span>
            </h1>

            <motion.div
              className="tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, ...springs.gentle }}
            >
              <span className="tagline-mark">{"<"}</span>
              <span className="tagline-text">Especialista em Automações &amp; IA</span>
              <span className="tagline-mark">{"/>"}</span>
            </motion.div>

            <AnimatePresence>
              {t.showStatus && (
                <motion.div
                  className="status"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ delay: 1.2, ...springs.bouncy }}
                >
                  <span className="status-dot" />
                  <span className="mono">disponível para projetos</span>
                  <span className="dim mono">· responde em ~2h</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Section header */}
        <motion.div
          className="section-head"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <span className="mono dim">// canais &amp; links</span>
          <span className="rule" />
          <span className="mono dim">{LINKS.length.toString().padStart(2, "0")} entries</span>
        </motion.div>

        {/* Cards */}
        <motion.section
          className="cards"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {LINKS.map((item, i) => (
            <LinkCard
              key={item.id}
              item={item}
              index={i}
              accent={t.accent}
              count={counts[item.id] || 0}
              onClick={bump}
              density={t.density}
            />
          ))}

          {/* Placeholder */}
          <motion.div
            className="card card-empty"
            variants={fadeUp}
            custom={LINKS.length}
            data-cursor="link"
            whileHover={{ borderColor: "var(--accent)", background: "var(--card-bg-hover)" }}
            transition={springs.gentle}
          >
            <div className="card-empty-inner mono">
              <span className="dim">+ </span>
              <span>novo link em breve</span>
              <span className="dim">_</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="footer mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="footer-row">
            <span className="dim">total clicks:</span>
            <span>{total.toString().padStart(4, "0")}</span>
            <span className="dim">·</span>
            <span className="dim">build</span>
            <span>2026.04</span>
          </div>
          <div className="footer-row">
            <span className="dim">© cleber cardoso · made with</span>
            <span style={{ color: t.accent }}>▲</span>
            <span className="dim">e café</span>
          </div>
        </motion.footer>
      </main>

      {/* Tweaks Panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakRadio label="Modo" value={t.theme}
          options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakColor label="Cor de acento" value={t.accent}
          onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Grão" value={t.grain}
          onChange={(v) => setTweak("grain", v)} />
        <TweakToggle label="Scanlines" value={t.scanline}
          onChange={(v) => setTweak("scanline", v)} />

        <TweakSection label="Tipografia" />
        <TweakSelect label="Fonte display" value={t.fontDisplay}
          options={Object.keys(FONT_OPTIONS)}
          onChange={(v) => setTweak("fontDisplay", v)} />

        <TweakSection label="Conteúdo" />
        <TweakRadio label="Densidade" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakToggle label="Mostrar status" value={t.showStatus}
          onChange={(v) => setTweak("showStatus", v)} />

        <TweakButton label="Resetar contadores"
          onClick={() => { try { localStorage.removeItem("cleber_link_clicks_v1"); } catch {} ; location.reload(); }} />
      </TweaksPanel>
    </motion.div>
  );
}

export default App;
