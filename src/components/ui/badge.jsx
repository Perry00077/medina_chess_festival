import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-primary/15 text-primary',
      secondary: 'bg-white/8 text-slate-200',
      success: 'bg-emerald-500/15 text-emerald-300',
      danger: 'bg-danger/15 text-danger',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
