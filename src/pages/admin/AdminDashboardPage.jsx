import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Globe2, LogOut, Search, Sparkles, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { dictionary, language, languages } = useLanguage()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadRows() {
      const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })

      if (!error && mounted) {
        setRows(data || [])
      }
      if (mounted) setLoading(false)
    }

    loadRows()

    const channel = supabase
      .channel('registrations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => loadRows())
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const formatWithLocale = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return formatDate(value)
    return date.toLocaleString(languages[language]?.locale || 'fr-FR')
  }

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) => [row.full_name, row.email, row.country, row.tournament, row.hotel].filter(Boolean).some((value) => String(value).toLowerCase().includes(term)))
  }, [rows, search])

  const stats = useMemo(() => {
    const countries = new Set(rows.map((row) => row.country).filter(Boolean)).size
    const latest = rows[0]?.created_at ? formatWithLocale(rows[0].created_at) : '-'
    return [
      { label: dictionary.totalRegistrations, value: rows.length, icon: Users },
      { label: dictionary.representedCountries, value: countries, icon: Globe2 },
      { label: dictionary.latestEntry, value: latest, icon: Activity },
    ]
  }, [rows, dictionary, language])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6efe5_0%,#f1e5d0_100%)] px-4 py-8 text-[#1f1812]">
      <div className="container space-y-6">
        <div className="overflow-hidden rounded-[36px] border border-[#d8ccb5] bg-[#111111] text-[#f4ece1] shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f1d57b]">
                {dictionary.dashboardBadge}
              </div>
              <h1 className="mt-5 font-display text-4xl text-white">{dictionary.dashboardTitle}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#ddd2c0]">
                {dictionary.dashboardDescription}{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5">registrations</code>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LanguageSwitcher compact />
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c9a227]/35 hover:text-[#f1d57b]"
              >
                <LogOut className="h-4 w-4" />
                {dictionary.signOut}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.3fr]">
          {stats.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-[30px] border border-[#d8ccb5] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a227]/12 text-[#a07c24]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-[#776b5c]">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-[#1f1812]">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}

          <div className="rounded-[30px] border border-[#d4bf7a] bg-[#111111] p-5 text-[#f4ece1] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3 text-[#f0d37b]"><Sparkles className="h-5 w-5" /> {dictionary.liveSearch}</div>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f9383]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={dictionary.searchPlaceholder}
                className="border-[#3a3128] bg-[#1b1712] pl-11 text-white placeholder:text-[#9f9383] focus-visible:ring-[#c9a227]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-[#d8ccb5] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#eadcc4] px-6 py-5">
            <h2 className="font-display text-3xl text-[#1f1812]">{dictionary.latestEntries}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d5448]">{dictionary.syncedListText}</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="rounded-[24px] border border-[#eadcc4] bg-[#fcfaf6] px-4 py-8 text-center text-[#5d5448]">{dictionary.loadingRegistrations}</div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-[24px] border border-[#eadcc4] bg-[#fcfaf6] px-4 py-8 text-center text-[#5d5448]">{dictionary.noRows}</div>
            ) : (
              <div className="overflow-hidden rounded-[28px] border border-[#eadcc4] bg-[#fcfaf6]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[#5d5448]">ID</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.firstName}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.lastName}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.email}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.country}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.tournament}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.hotel}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.message}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.date}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.map((row) => (
                        <TableRow key={row.id} className="border-[#efe4d3] hover:bg-white">
                          <TableCell className="font-mono text-xs text-[#8a7e6f]">{row.id.slice(0, 8)}</TableCell>
                          <TableCell className="text-[#1f1812]">{row.first_name}</TableCell>
                          <TableCell className="text-[#1f1812]">{row.last_name}</TableCell>
                          <TableCell className="text-[#433b30]">{row.email}</TableCell>
                          <TableCell className="text-[#433b30]">{row.country}</TableCell>
                          <TableCell>
                            <span className="inline-flex rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8e6717]">
                              {row.tournament}
                            </span>
                          </TableCell>
                          <TableCell className="text-[#433b30]">{row.hotel || '—'}</TableCell>
                          <TableCell className="max-w-[240px] truncate text-[#5d5448]">{row.message || '—'}</TableCell>
                          <TableCell className="text-[#433b30]">{formatWithLocale(row.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
