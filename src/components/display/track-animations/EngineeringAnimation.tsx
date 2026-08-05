'use client'

function DumpTruck() {
  return (
    <svg width="300" height="95" viewBox="0 0 300 95" fill="none" aria-hidden="true">
      {/* Chassis */}
      <rect x="12" y="52" width="268" height="15" rx="3" fill="#C47A1A" />
      {/* Dump bed */}
      <rect x="18" y="16" width="150" height="40" rx="4" fill="#F5A623" />
      <rect x="18" y="16" width="6" height="40" fill="#C47A1A" />
      {/* Cab */}
      <rect x="168" y="10" width="100" height="56" rx="8" fill="#E8951F" />
      {/* Windshield */}
      <rect x="182" y="17" width="60" height="30" rx="4" fill="#87CEEB" opacity="0.8" />
      {/* Grille */}
      <rect x="260" y="30" width="20" height="26" rx="3" fill="#C47A1A" />
      {/* Headlight */}
      <circle cx="272" cy="43" r="6" fill="#FFF9C4" />
      {/* Exhaust stack */}
      <rect x="174" y="0" width="9" height="18" rx="4" fill="#777" />
      {/* Rear wheels */}
      <circle cx="68" cy="72" r="22" fill="#222" />
      <circle cx="68" cy="72" r="13" fill="#444" />
      <circle cx="68" cy="72" r="5" fill="#888" />
      {/* Front wheel */}
      <circle cx="218" cy="72" r="22" fill="#222" />
      <circle cx="218" cy="72" r="13" fill="#444" />
      <circle cx="218" cy="72" r="5" fill="#888" />
    </svg>
  )
}

function TowerCrane() {
  return (
    <svg
      width="320" height="390" viewBox="0 0 320 390"
      fill="none" aria-hidden="true"
    >
      {/* Tower */}
      <rect x="248" y="96" width="16" height="290" rx="3" fill="#F5A623" />
      {/* Cross bracing */}
      <line x1="248" y1="100" x2="264" y2="148" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="264" y1="100" x2="248" y2="148" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="248" y1="150" x2="264" y2="198" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="264" y1="150" x2="248" y2="198" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="248" y1="200" x2="264" y2="248" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="264" y1="200" x2="248" y2="248" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="248" y1="250" x2="264" y2="298" stroke="#E8951F" strokeWidth="2.5" />
      <line x1="264" y1="250" x2="248" y2="298" stroke="#E8951F" strokeWidth="2.5" />

      {/* Operator cabin */}
      <rect x="238" y="68" width="38" height="36" rx="5" fill="#E8951F" />
      <rect x="246" y="74" width="22" height="22" rx="3" fill="#87CEEB" opacity="0.7" />

      {/* Main boom extending left */}
      <rect x="12" y="60" width="226" height="14" rx="4" fill="#F5A623" />
      <circle cx="20" cy="67" r="7" fill="#C47A1A" />

      {/* Counter jib extending right */}
      <rect x="264" y="60" width="50" height="14" rx="4" fill="#F5A623" />
      <rect x="302" y="70" width="12" height="28" rx="3" fill="#666" />

      {/* Support cables */}
      <line x1="257" y1="70" x2="20" y2="68" stroke="#CCC" strokeWidth="1.5" />
      <line x1="257" y1="70" x2="314" y2="68" stroke="#CCC" strokeWidth="1.5" />

      {/* Swinging cable and load — rotates around the boom-tip pulley */}
      <g
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'top center',
          animation: 'engineeringSwingLoad 4.5s ease-in-out infinite',
        } as React.CSSProperties}
      >
        {/* Cable */}
        <line x1="20" y1="74" x2="20" y2="262" stroke="#BBB" strokeWidth="2" />
        {/* Hook */}
        <path d="M 17 260 Q 13 274 20 278 Q 27 282 24 272" stroke="#999" strokeWidth="2.5" fill="none" />
        {/* I-beam bundle */}
        <rect x="4" y="282" width="36" height="7" rx="1.5" fill="#888" />
        <rect x="7" y="286" width="30" height="2" fill="#AAA" />
        <rect x="4" y="292" width="36" height="7" rx="1.5" fill="#888" />
        <rect x="7" y="296" width="30" height="2" fill="#AAA" />
        <rect x="4" y="302" width="36" height="7" rx="1.5" fill="#888" />
        <rect x="7" y="306" width="30" height="2" fill="#AAA" />
        {/* Sling */}
        <line x1="20" y1="278" x2="6" y2="285" stroke="#999" strokeWidth="1.5" />
        <line x1="20" y1="278" x2="36" y2="285" stroke="#999" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

export function EngineeringAnimation() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-70"
      style={{ zIndex: 1 }}
    >
      <style>{`
        @keyframes engineeringDriveTruck {
          0%   { transform: translateX(-320px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes engineeringSwingLoad {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg); }
        }
      `}</style>

      {/* Tower crane anchored at the right edge */}
      <div className="absolute" style={{ right: 0, top: '12%' }}>
        <TowerCrane />
      </div>

      {/* Dump truck driving left to right across the bottom */}
      <div
        className="absolute bottom-3"
        style={{ animation: 'engineeringDriveTruck 28s linear infinite' }}
      >
        <DumpTruck />
      </div>
    </div>
  )
}
