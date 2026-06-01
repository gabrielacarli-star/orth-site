interface LogoProps {
  size?: number
  /** true = fundo escuro → letras brancas */
  light?: boolean
  className?: string
}

export function Logo({ size = 36, light = true, className = "" }: LogoProps) {
  const letterColor = light ? "#FFFFFF" : "#0A1C4E"

  return (
    <svg
      width={size * 3.1}
      height={size}
      viewBox="0 0 112 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ORTH Digital"
      role="img"
    >
      <defs>
        <linearGradient id="pinGrad" x1="13" y1="0" x2="13" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#7CB3FF" />
          <stop offset="55%"  stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0A1C4E" />
        </linearGradient>
      </defs>

      {/* O — Pin de localização (teardrop com buraco = letter O) */}
      {/* fillRule="evenodd" perfura o círculo interno, criando o O */}
      <path
        fillRule="evenodd"
        d="
          M 13 0.5
          C 6.6 0.5 1.5 5.6 1.5 12
          C 1.5 18.4 7.2 23.5 13 34.5
          C 18.8 23.5 24.5 18.4 24.5 12
          C 24.5 5.6 19.4 0.5 13 0.5 Z

          M 13 7
          C 9.7 7 7 9.7 7 13
          C 7 16.3 9.7 19 13 19
          C 16.3 19 19 16.3 19 13
          C 19 9.7 16.3 7 13 7 Z
        "
        fill="url(#pinGrad)"
      />

      {/* RTH — serif bold, azul-marinho ou branco conforme fundo */}
      <text
        x="30"
        y="27"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="1"
        fill={letterColor}
      >
        RTH
      </text>
    </svg>
  )
}
