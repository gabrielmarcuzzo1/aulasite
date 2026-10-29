import { useId } from "react";

// A projected height field: vector geometry, no WebGL or image dependency.
function project(x: number, z: number) {
  const height =
    7.8 *
    (1 - Math.exp(-(x * x) / 45)) *
    (0.77 + 0.23 * Math.sin(z * 0.11 + Math.abs(x) * 0.1));
  return `${(720 + (x / z) * 600).toFixed(2)},${(114 + ((5 - height) / z) * 700).toFixed(2)}`;
}

const longitudinal = Array.from({ length: 117 }, (_, i) => {
  const x = (i - 58) * 0.37;
  return Array.from(
    { length: 100 },
    (_, j) => `${j ? "L" : "M"}${project(x, 2.2 + j * 0.53)}`,
  ).join(" ");
});
const lateral = Array.from({ length: 46 }, (_, i) => {
  const z = 2.8 + Math.pow(i / 45, 1.5) * 49;
  return Array.from(
    { length: 121 },
    (_, j) => `${j ? "L" : "M"}${project((j - 60) * 0.5, z)}`,
  ).join(" ");
});

export default function WaveField({ className = "" }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className={`wave-field ${className}`}
      viewBox="0 0 1440 520"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`wave-${id}`}
          x1="720"
          y1="40"
          x2="720"
          y2="520"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.35" stopColor="#bcbcbc" stopOpacity="0.46" />
          <stop offset="0.75" stopColor="#999" stopOpacity="0.28" />
          <stop offset="1" stopColor="#999" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`fade-${id}`}>
          <stop offset="0.2" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-${id}`}>
          <rect width="1440" height="520" fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <g
        stroke={`url(#wave-${id})`}
        strokeWidth="0.75"
        mask={`url(#mask-${id})`}
      >
        {longitudinal.map((d, i) => (
          <path key={`l${i}`} d={d} />
        ))}
        {lateral.map((d, i) => (
          <path key={`h${i}`} d={d} opacity="0.35" />
        ))}
      </g>
    </svg>
  );
}
