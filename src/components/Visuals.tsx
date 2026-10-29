import {
  ArrowUpRight,
  Check,
  Circle,
  Crosshair,
  MousePointer2,
  Play,
  Workflow,
} from "lucide-react";

export function TrafficVisual() {
  return (
    <div className="service-visual traffic-visual" aria-hidden="true">
      <div className="visual-caption">
        <span className="tiny-dot" />
        LEADS QUALIFICADOS
        <ArrowUpRight size={14} />
      </div>
      <div className="chart-bars">
        {[21, 29, 26, 41, 36, 53, 47, 67, 62, 82, 75, 100].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%`, opacity: 0.25 + i * 0.065 }}
          />
        ))}
      </div>
      <svg className="chart-line" viewBox="0 0 300 100" fill="none">
        <path
          d="m5 90 27-17 26 5 26-24 26 6 27-19 26 7 26-29 26 5 27-18 25 1 23-17"
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>
      <span className="chart-pointer">
        <MousePointer2 size={16} fill="white" />
      </span>
    </div>
  );
}

export function ContentVisual() {
  return (
    <div className="service-visual content-visual" aria-hidden="true">
      <div className="content-tile tile-back">
        <div className="abstract-lines" />
        <span>CONTEÚDO</span>
      </div>
      <div className="content-tile tile-front">
        <div className="tile-logo">
          V3<span>AGÊNCIA</span>
        </div>
        <div className="play-icon">
          <Play size={15} fill="currentColor" />
        </div>
        <span>AUTORIDADE</span>
      </div>
      <div className="content-bubble">
        <Check size={11} />
        Sua marca, em evidência.
      </div>
    </div>
  );
}

export function FunnelVisual() {
  return (
    <div className="service-visual funnel-visual" aria-hidden="true">
      <div className="funnel-orbit orbit-one" />
      <div className="funnel-orbit orbit-two" />
      <div className="flow-node node-one">
        <MousePointer2 size={18} />
      </div>
      <div className="flow-node node-two">
        <Workflow size={23} />
      </div>
      <div className="flow-node node-three">
        <Check size={18} />
      </div>
      <span className="flow-label label-one">LEAD</span>
      <span className="flow-label label-two">REUNIÃO</span>
    </div>
  );
}

export function StrategyVisual() {
  return (
    <div className="strategy-visual" aria-hidden="true">
      <div className="strategy-grid" />
      <div className="strategy-orbit orbit-outer" />
      <div className="strategy-orbit orbit-inner" />
      <div className="strategy-core">
        <Crosshair size={38} strokeWidth={1} />
      </div>
      <div className="strategy-label strategy-label--one">
        <Circle size={9} />
        Atrair
      </div>
      <div className="strategy-label strategy-label--two">
        <Circle size={9} />
        Qualificar
      </div>
      <div className="strategy-label strategy-label--three">
        <Check size={11} />
        Converter
      </div>
      <div className="strategy-axis axis-h" />
      <div className="strategy-axis axis-v" />
    </div>
  );
}
