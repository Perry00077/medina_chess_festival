import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary/90',
        secondary: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        outline: 'border border-primary/25 bg-transparent text-primary hover:bg-primary/10',
        ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
        danger: 'bg-danger/90 text-white hover:bg-danger',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 rounded-xl px-4',
        lg: 'h-12 rounded-2xl px-6 text-base',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { buttonVariants }
