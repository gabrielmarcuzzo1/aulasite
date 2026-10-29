import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  Mail,
  RotateCcw,
} from "lucide-react";

const leadEndpoint = import.meta.env.VITE_LEAD_ENDPOINT?.trim();

export default function LeadForm() {
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const statusRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);
  const hasStatus = Boolean(emailDraft) || state === "sent";

  useEffect(() => {
    if (hasStatus) statusRef.current?.focus();
    else if (returnFocus.current) {
      // Restore focus after the browser updates the form's inert state.
      const frame = window.requestAnimationFrame(() => {
        document.getElementById("lead-name")?.focus();
        returnFocus.current = false;
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [hasStatus]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    if (state === "sending") return;
    if (leadEndpoint) {
      setState("sending");
      try {
        const response = await fetch(leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(values)),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error("Lead submission failed");
        setState("sent");
      } catch {
        setState("error");
      }
      return;
    }
    const body = `Olá, Agência V3! Quero agendar meu diagnóstico gratuito de 30 minutos.\n\nNome: ${values.get("name")}\nE-mail profissional: ${values.get("email")}\nWhatsApp: ${values.get("phone")}\nEmpresa: ${values.get("company")}\n\nPodemos combinar um horário?`;
    const href = `mailto:contato@agenciav3.com.br?subject=${encodeURIComponent("Diagnóstico gratuito — Agência V3")}&body=${encodeURIComponent(body)}`;
    setEmailDraft(href);
  }

  return (
    <div className="form-card">
      <form
        onSubmit={submit}
        aria-busy={state === "sending"}
        inert={hasStatus}
        style={{ opacity: hasStatus ? 0 : 1 }}
      >
        <div className="form-topline">
          <span className="tiny-dot" />
          DIAGNÓSTICO GRATUITO<span>30 MIN</span>
        </div>
        <div className="form-field">
          <label htmlFor="lead-name">Nome</label>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            placeholder="Seu nome completo"
            required
            minLength={2}
            maxLength={120}
          />
        </div>
        <div className="form-field">
          <label htmlFor="lead-email">E-mail profissional</label>
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com.br"
            required
            maxLength={254}
          />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="lead-phone">WhatsApp</label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(11) 99999-9999"
              title="Informe o número com DDD, incluindo de 10 a 15 dígitos."
              required
              minLength={10}
              maxLength={22}
              onInput={(event) => {
                const input = event.currentTarget;
                const digits = input.value.replace(/\D/g, "").length;
                input.setCustomValidity(
                  /^[+()\d\s.-]+$/.test(input.value) &&
                    digits >= 10 &&
                    digits <= 15
                    ? ""
                    : "Informe um telefone com DDD, de 10 a 15 dígitos.",
                );
              }}
            />
          </div>
          <div className="form-field">
            <label htmlFor="lead-company">Empresa</label>
            <input
              id="lead-company"
              name="company"
              autoComplete="organization"
              placeholder="Nome da empresa"
              required
              minLength={2}
              maxLength={160}
            />
          </div>
        </div>
        <button
          className="button form-submit"
          type="submit"
          disabled={state === "sending"}
        >
          {state === "sending" ? "Enviando…" : "Quero agendar meu diagnóstico"}
          {state === "sending" ? (
            <LoaderCircle
              className="loading-icon"
              size={18}
              aria-hidden="true"
            />
          ) : (
            <ArrowUpRight size={18} aria-hidden="true" />
          )}
        </button>
        <p className="form-note">
          <Mail size={12} aria-hidden="true" />
          {leadEndpoint ? (
            "O horário será confirmado pela nossa equipe."
          ) : (
            <span>
              Agendamento online em breve.{" "}
              <a href="mailto:contato@agenciav3.com.br">Contato por e-mail.</a>
            </span>
          )}
        </p>
        {state === "error" && (
          <p className="form-error" role="alert">
            Não foi possível enviar agora. Tente novamente ou fale com a gente
            pelo <a href="mailto:contato@agenciav3.com.br">e-mail</a>.
          </p>
        )}
      </form>
      {(emailDraft || state === "sent") && (
        <div
          className="form-status"
          role="status"
          tabIndex={-1}
          ref={statusRef}
        >
          <span className="status-icon">
            <Check size={20} aria-hidden="true" />
          </span>
          <h3>
            {state === "sent"
              ? "Recebemos seu pedido."
              : "Agendamento online em breve."}
          </h3>
          <p>
            {state === "sent"
              ? "A equipe da Agência V3 entrará em contato para combinar seu diagnóstico gratuito de 30 minutos."
              : "Enquanto isso, você pode falar com a Agência V3 por e-mail. Sua mensagem está preparada: basta revisar e enviar no seu aplicativo."}
          </p>
          {emailDraft && (
            <a className="button" href={emailDraft}>
              Abrir e-mail
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          <button
            className="edit-form"
            type="button"
            onClick={() => {
              returnFocus.current = true;
              setEmailDraft(null);
              setState("idle");
            }}
          >
            <RotateCcw size={12} aria-hidden="true" />
            {state === "sent" ? "Voltar ao formulário" : "Editar meus dados"}
          </button>
        </div>
      )}
    </div>
  );
}
