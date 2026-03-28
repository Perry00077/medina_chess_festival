import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export default function AdminLoginPage() {
  const { dictionary } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const { data: adminRow } = await supabase.from('admin_users').select('id').eq('id', data.user.id).maybeSingle()

    if (!adminRow) {
      await supabase.auth.signOut()
      setError(dictionary.adminUnauthorized)
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#111111_0%,#1a1510_100%)] px-4 py-10 text-white">
      <div className="container">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher compact />
        </div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl overflow-hidden rounded-[38px] border border-[#c9a227]/18 bg-[#f6efe5] text-[#1f1812] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-[#eadcc4] bg-[linear-gradient(145deg,#111111_0%,#231d16_100%)] p-8 text-[#f4ece1] lg:border-b-0 lg:border-r lg:border-r-[#c9a227]/14">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-[#c9a227]/25 bg-[#c9a227]/10 text-[#e7c86f]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="mt-6 inline-flex rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f2d77e]">
                {dictionary.adminAuthBadge}
              </div>
              <h1 className="mt-6 font-display text-4xl text-white">{dictionary.adminLoginTitle}</h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#ddd2c0]">
                {dictionary.adminSecureIntro}{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-[#f6e094]">admin_users</code>{' '}
                {dictionary.adminLoginText.replace(/^.*?\.\s*/, '')}
              </p>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 text-[#a07c24]">
                <LockKeyhole className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">{dictionary.adminLoginTitle}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl text-[#1f1812]">{dictionary.adminPanelAccess}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5d5448]">{dictionary.adminPanelNote}</p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#4c4338]">{dictionary.email}</span>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                    className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#4c4338]">{dictionary.password}</span>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    required
                    className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
                  />
                </label>

                {error ? <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</div> : null}

                <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full bg-[#c9a227] text-[#111111] shadow-none hover:bg-[#d7b966]">
                  {loading ? dictionary.signInLoading : dictionary.signIn}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
