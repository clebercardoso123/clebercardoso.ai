import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// ── Spring presets ──────────────────────────────────────────────────────────
export const springs = {
  gentle: { type: "spring", stiffness: 120, damping: 14, mass: 1 },
  bouncy: { type: "spring", stiffness: 300, damping: 15, mass: 0.8 },
  stiff: { type: "spring", stiffness: 400, damping: 30, mass: 0.5 },
  slow: { type: "spring", stiffness: 80, damping: 20, mass: 1.2 },
  snappy: { type: "spring", stiffness: 500, damping: 25, mass: 0.6 },
};

// ── Variant collections ────────────────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, ...springs.gentle },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, ...springs.bouncy },
  }),
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, ...springs.gentle },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

// ── Character-by-character text reveal ─────────────────────────────────────
export function AnimatedText({ text, delay = 0, className, style, ...props }) {
  return (
    <motion.span className={className} style={{ display: "inline-flex", flexWrap: "wrap", ...style }} {...props}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.035,
            ...springs.bouncy,
          }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── 3D Tilt wrapper ────────────────────────────────────────────────────────
export function Tilt3D({ children, strength = 12, style, className, ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [strength, -strength]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-strength, strength]);

  const springRotateX = useSpring(rotateX, springs.stiff);
  const springRotateY = useSpring(rotateY, springs.stiff);

  function handleMouse(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        ...style,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── Magnetic hover effect ──────────────────────────────────────────────────
export function useMagneticEffect(strength = 0.25) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springs.stiff);
  const springY = useSpring(y, springs.stiff);

  const ref = React.useRef(null);

  const handleMouse = React.useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      x.set(dx * strength);
      y.set(dy * strength);
    },
    [x, y, strength]
  );

  const handleLeave = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, handleMouse, handleLeave, x: springX, y: springY };
}

// ── Shimmer overlay for cards ──────────────────────────────────────────────
export function ShimmerOverlay({ mouseX, mouseY, accent }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        background: `radial-gradient(320px circle at ${mouseX}px ${mouseY}px, ${accent}18, transparent 60%)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ── Animate on scroll into view ────────────────────────────────────────────
export function RevealOnScroll({ children, className, style, ...props }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      {...props}
    >
      {children}
    </motion.div>
  );
}
