interface LogoProps {
  className?: string
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="1.5" y="2.5" width="15" height="13" rx="2" stroke="white" strokeWidth="1.6" />
          <path d="M9 2.5v13" stroke="white" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="text-lg font-semibold">Tədris Paneli</span>
    </div>
  )
}

export default Logo
