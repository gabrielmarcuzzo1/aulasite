import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./UI";

const links = [
  ["Soluções", "#solucoes"],
  ["Como funciona", "#como-funciona"],
  ["Resultados", "#resultados"],
  ["Perguntas frequentes", "#perguntas"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <a
          href="#inicio"
          className="brand-link"
          aria-label="Agência V3 — início"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </a>
        <nav aria-label="Navegação principal" className="desktop-nav">
          {links.slice(0, 3).map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#diagnostico">
          Quero meu diagnóstico gratuito
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <button
          id="menu-toggle"
          className="menu-toggle"
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Navegação mobile"
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map(([label, href]) => (
              <a href={href} key={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
            <a
              className="mobile-cta"
              href="#diagnostico"
              onClick={() => setOpen(false)}
            >
              Quero meu diagnóstico gratuito
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
