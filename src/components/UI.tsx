import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand--compact" : ""}`}>
      <svg viewBox="0 0 73 42" fill="none" aria-hidden="true">
        <path
          d="M3 6 18 36 33 6M43 6h24L47 21h11c15 0 15 15 0 15H41"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && (
        <span>
          AGÊNCIA<span>MARKETING & VENDAS</span>
        </span>
      )}
    </span>
  );
}

export function Button({
  children,
  className = "",
  href = "#diagnostico",
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  return (
    <a className={`button ${className}`} href={href}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={
        reduced
          ? undefined
          : { opacity: [0, 1], y: [24, 0], filter: ["blur(4px)", "blur(0px)"] }
      }
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  number,
  label,
  title,
  children,
  align = "center",
}: {
  number: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      <span className="eyebrow">
        <span>{number}</span>
        <span className="eyebrow-line" />
        {label}
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  );
}

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="section-tag">
      <Sparkles size={12} aria-hidden="true" />
      {children}
    </span>
  );
}
