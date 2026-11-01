import type { ReactNode } from 'react'
import Logo from '../components/common/Logo'

interface AuthLayoutProps {
  title: string
  description: string
  // "bullets" — nöqtəli siyahı (login), "steps" — nömrələnmiş addımlar (qeydiyyat)
  listType: 'bullets' | 'steps'
  items: string[]
  children: ReactNode
}

const AuthLayout = ({ title, description, listType, items, children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Sol panel — yalnız böyük ekranlarda */}
      <aside className="hidden w-[400px] shrink-0 flex-col justify-between bg-sidebar px-12 py-12 text-white lg:flex">
        <Logo />

        <div>
          <h1 className="mb-5 text-[44px] font-bold leading-[1.1] tracking-tight">{title}</h1>
          <p className="mb-8 text-base leading-relaxed text-white/70">{description}</p>

          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={item} className="flex items-center gap-3 text-[15px] text-white/90">
                {listType === 'steps' ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-emerald-300">
                    {index + 1}
                  </span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/50">© 2026 Tədris Paneli</p>
      </aside>

      {/* Sağ tərəf — forma */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <Logo className="mb-8 text-gray-900 lg:hidden" />
        {children}
      </main>
    </div>
  )
}

export default AuthLayout
