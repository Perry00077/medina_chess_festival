import { cn } from '@/lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn('flex h-11 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', className)}
      {...props}
    />
  )
}
