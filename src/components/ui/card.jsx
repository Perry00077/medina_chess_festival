import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return <div className={cn('glass-card rounded-3xl', className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-2 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('font-display text-2xl font-bold text-white', className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm leading-6 text-slate-300', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
