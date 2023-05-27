interface LogoVariantProps {
  variant?: "pulsing" | "simple" | "spinner" // 👈️ marked optional
}

export function LogoVariant({ variant = "pulsing", }: LogoVariantProps) {
  // To match our logo (svg) we use the same coordinate viewBox 0 0 64 64
  // But to make scaling and coordinate math sane we translate by 32,32 
  // to have the coordinates centered at 0,0
  const strokeColor = "grey"
  const strokeWidth = 6;
  const dur = 2 // duration for animation
  const loadingSpinner = variant === "spinner"
  const pulsing = variant === "pulsing"
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 64 64">
      <g transform="translate(32,32)scale(0.8,0.8)"
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        strokeLinejoin="round" strokeLinecap="round" fill="none">
        {/* Both the inner e and the outer C have a 22.5 degree opening */}
        {/* This is an e */}
        <g transform="rotate(67.5)">
          {loadingSpinner && <animateTransform attributeName="transform" attributeType="XML"
            type="rotate" from="67.5" to="427.5" dur={dur} repeatCount="indefinite" />}

          {/* A rx, ry x-axis-rotation large-arc-flag, sweep-flag x, y */}
          <path d="M0,0 L0,-20 A20,20 0 1 0 14.14,-14.14" />
        </g>

        {/* This is a backwards C */}
        <g transform="scale(-1,1)">
          <g transform="rotate(67.5)">
            {loadingSpinner && <animateTransform attributeName="transform" attributeType="XML"
              type="rotate" from="67.5" to="427.5" dur={dur} repeatCount="indefinite" />}
            <path d="M0,-30 A30,30 0 1 0 21.21,-21.21" />
          </g>
        </g>
        {pulsing &&
          <>
            {/* propagating circle */}
            <circle cx="0" cy="0" r="5" stroke="grey" strokeWidth=".5">
              <animate attributeName="r" values="5;30" dur={dur * 2} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur={dur * 2} repeatCount="indefinite" />
            </circle>
            {/* pulsing red dot glow */}
            <circle cx="0" cy="0" r="5" stroke="none" fill="red" >
              <animate attributeName="r" values="5;7;5;5;5" dur={dur} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;.5;0;0;0" dur={dur} repeatCount="indefinite" />
            </circle>
          </>}
        {/* red dot */}
        <circle cx="0" cy="0" r="5" stroke="none" fill="red" />
      </g>
    </svg>
  )
}

// Just our regular CSV file as a component
export function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 64 64">
      <g transform="translate(32,32)scale(0.8,0.8)" strokeWidth="6" stroke="grey" stroke-linejoin="round" strokeLinecap="round" fill="none">
        {/*  "e"  */}
        <g transform="rotate(67.5)">
          <path d="M0,0 L0,-20 A20,20 0 1 0 14.14,-14.14" />
        </g>
        {/* backwards "C" */}
        <g transform="scale(-1,1)">
          <g transform="rotate(67.5)">
            <path d="M0,-30 A30,30 0 1 0 21.21,-21.21" />
          </g>
        </g>
        {/* propagating circle */}
        <circle cx="0" cy="0" r="5" stroke="grey" strokeWidth=".5">
          <animate attributeName="r" values="5;30" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* pulsing red dot glow */}
        <circle cx="0" cy="0" r="5" stroke="none" fill="red">
          <animate attributeName="r" values="5;7;5;5;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;.5;0;0;0" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* red dot */}
        <circle cx="0" cy="0" r="5" stroke="none" fill="red" />
      </g>
    </svg>
  )
}
