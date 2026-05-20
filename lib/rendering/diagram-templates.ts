import type { DiagramTemplate } from "@/lib/types/editor";

export function renderDiagramTemplate(template: DiagramTemplate) {
  if (template === "coordinate-plane") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" fill="none">
        <rect width="320" height="220" rx="20" fill="#fffdfa"/>
        <g stroke="rgba(35,50,40,0.08)">
          <line x1="32" y1="20" x2="32" y2="200"/>
          <line x1="80" y1="20" x2="80" y2="200"/>
          <line x1="128" y1="20" x2="128" y2="200"/>
          <line x1="176" y1="20" x2="176" y2="200"/>
          <line x1="224" y1="20" x2="224" y2="200"/>
          <line x1="272" y1="20" x2="272" y2="200"/>
          <line x1="20" y1="38" x2="300" y2="38"/>
          <line x1="20" y1="74" x2="300" y2="74"/>
          <line x1="20" y1="110" x2="300" y2="110"/>
          <line x1="20" y1="146" x2="300" y2="146"/>
          <line x1="20" y1="182" x2="300" y2="182"/>
        </g>
        <line x1="20" y1="110" x2="300" y2="110" stroke="#233228" stroke-width="2"/>
        <line x1="160" y1="20" x2="160" y2="200" stroke="#233228" stroke-width="2"/>
        <path d="M68 154C92 118 116 84 142 74C166 64 196 90 218 110C240 130 260 142 286 76" stroke="#d95f33" stroke-width="4" stroke-linecap="round"/>
        <circle cx="142" cy="74" r="6" fill="#d95f33"/>
      </svg>
    `.trim();
  }

  if (template === "ray-optics") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" fill="none">
        <rect width="320" height="220" rx="20" fill="#fffdfa"/>
        <line x1="30" y1="110" x2="290" y2="110" stroke="#233228" stroke-width="2"/>
        <line x1="170" y1="30" x2="170" y2="190" stroke="#233228" stroke-dasharray="8 8" stroke-width="2"/>
        <path d="M120 50C140 80 150 95 170 110C190 125 202 140 220 170" stroke="#d95f33" stroke-width="4" stroke-linecap="round"/>
        <path d="M52 62L170 110" stroke="#31543e" stroke-width="4" stroke-linecap="round"/>
        <path d="M52 158L170 110" stroke="#31543e" stroke-width="4" stroke-linecap="round"/>
        <circle cx="170" cy="110" r="10" fill="#fff4ea" stroke="#d95f33" stroke-width="3"/>
      </svg>
    `.trim();
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" fill="none">
      <rect width="320" height="220" rx="20" fill="#fffdfa"/>
      <rect x="112" y="82" width="68" height="56" rx="12" fill="#fff4ea" stroke="#d95f33" stroke-width="3"/>
      <line x1="146" y1="82" x2="146" y2="34" stroke="#31543e" stroke-width="4" stroke-linecap="round"/>
      <line x1="146" y1="138" x2="146" y2="186" stroke="#31543e" stroke-width="4" stroke-linecap="round"/>
      <line x1="112" y1="110" x2="68" y2="110" stroke="#31543e" stroke-width="4" stroke-linecap="round"/>
      <line x1="180" y1="110" x2="228" y2="110" stroke="#31543e" stroke-width="4" stroke-linecap="round"/>
      <path d="M146 34L140 46H152L146 34Z" fill="#31543e"/>
      <path d="M146 186L140 174H152L146 186Z" fill="#31543e"/>
      <path d="M68 110L80 104V116L68 110Z" fill="#31543e"/>
      <path d="M228 110L216 104V116L228 110Z" fill="#31543e"/>
    </svg>
  `.trim();
}
