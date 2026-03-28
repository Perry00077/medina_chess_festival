import { cn } from '@/lib/utils'

export function Checkbox({ className, ...props }) {
  return <input type="checkbox" className={cn('h-4 w-4 rounded border-white/20 bg-slate-950/60 text-primary focus:ring-primary', className)} {...props} />
}
