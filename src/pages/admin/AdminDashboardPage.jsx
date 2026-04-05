import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileImage,
  FileText,
  Filter,
  Globe2,
  LogOut,
  Search,
  Trophy,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { formatDate } from '@/lib/utils'

const DOCUMENT_BUCKET = 'registration-documents'

function normalizeCompanions(value) {
  return Array.isArray(value) ? value : []
}

function hasCompanions(row) {
  return Boolean(row?.has_companion) || normalizeCompanions(row?.companions).length > 0
}

function getTournamentLabel(value, dictionary) {
  if (value === 'magistral') return dictionary.tournamentMagistral || 'Magistral'
  if (value === 'challenge') return dictionary.tournamentChallenge || 'Challenge'
  if (value === 'blitz') return dictionary.tournamentBlitz || 'Blitz'
  return value || '—'
}

function isImagePath(path) {
  return /\.(jpg|jpeg|png|webp)$/i.test(path || '')
}

function buildDocumentPathList(rows) {
  const paths = new Set()

  rows.forEach((row) => {
    if (row?.personal_passport_path) {
      paths.add(row.personal_passport_path)
    }

    normalizeCompanions(row?.companions).forEach((companion) => {
      if (companion?.passport_path) {
        paths.add(companion.passport_path)
      }
    })
  })

  return [...paths]
}

export default function AdminDashboardPage() {
  const { dictionary, language, languages } = useLanguage()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tournamentFilter, setTournamentFilter] = useState('all')
  const [companionFilter, setCompanionFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('')
  const [documentUrls, setDocumentUrls] = useState({})

  useEffect(() => {
    let mounted = true

    async function loadRows() {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && mounted) {
        setRows(data || [])
      }

      if (mounted) {
        setLoading(false)
      }
    }

    loadRows()

    const channel = supabase
      .channel('registrations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, loadRows)
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadDocumentUrls() {
      const paths = buildDocumentPathList(rows)

      if (!paths.length) {
        if (active) setDocumentUrls({})
        return
      }

      const urlEntries = await Promise.all(
        paths.map(async (path) => {
          const { data, error } = await supabase.storage
            .from(DOCUMENT_BUCKET)
            .createSignedUrl(path, 60 * 60)

          if (error || !data?.signedUrl) {
            return [path, null]
          }

          return [path, data.signedUrl]
        }),
      )

      if (!active) return

      setDocumentUrls(
        Object.fromEntries(urlEntries.filter(([, url]) => Boolean(url))),
      )
    }

    loadDocumentUrls()

    return () => {
      active = false
    }
  }, [rows])

  const formatWithLocale = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return formatDate(value)
    return date.toLocaleString(languages[language]?.locale || 'fr-FR')
  }

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    const countryTerm = countryFilter.trim().toLowerCase()

    return rows.filter((row) => {
      const rowHasCompanion = hasCompanions(row)
      const searchMatches = !term
        || [
          row.full_name,
          row.first_name,
          row.last_name,
          row.email,
          row.country,
          row.tournament,
          row.hotel,
          row.message,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term))

      const tournamentMatches = tournamentFilter === 'all' || row.tournament === tournamentFilter
      const countryMatches = !countryTerm || String(row.country || '').toLowerCase().includes(countryTerm)
      const companionMatches = companionFilter === 'all'
        || (companionFilter === 'with' && rowHasCompanion)
        || (companionFilter === 'without' && !rowHasCompanion)

      return searchMatches && tournamentMatches && countryMatches && companionMatches
    })
  }, [rows, search, tournamentFilter, countryFilter, companionFilter])

  const stats = useMemo(() => {
    const countries = new Set(filteredRows.map((row) => row.country).filter(Boolean)).size
    const byTournament = (tournament) => filteredRows.filter((row) => row.tournament === tournament).length

    return [
      {
        label: dictionary.displayedRegistrations || 'Affichage',
        value: `${filteredRows.length} / ${rows.length}`,
        icon: Users,
      },
      {
        label: dictionary.magistralTotal || 'Magistral',
        value: byTournament('magistral'),
        icon: Trophy,
      },
      {
        label: dictionary.challengeTotal || 'Challenge',
        value: byTournament('challenge'),
        icon: Trophy,
      },
      {
        label: dictionary.blitzTotal || 'Blitz',
        value: byTournament('blitz'),
        icon: Trophy,
      },
      {
        label: dictionary.representedCountries,
        value: countries,
        icon: Globe2,
      },
    ]
  }, [filteredRows, rows.length, dictionary])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  function clearFilters() {
    setSearch('')
    setTournamentFilter('all')
    setCompanionFilter('all')
    setCountryFilter('')
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
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#ddd2c0]">
                {dictionary.dashboardDescription}{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5">registrations</code>.{' '}
                {dictionary.syncedListText}
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[30px] border border-[#d8ccb5] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              >
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
        </div>

        <div className="rounded-[36px] border border-[#d8ccb5] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#946f1c]">
                <Filter className="h-4 w-4" />
                {dictionary.filters}
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d5448]">
                {dictionary.liveSearch} · {dictionary.searchPlaceholder}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="rounded-full border-[#d8ccb5] text-[#5d5448] hover:border-[#c9a227] hover:bg-[#c9a227]/10"
            >
              {dictionary.filters} · reset
            </Button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f9383]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={dictionary.searchPlaceholder}
                className="border-[#e7dbc7] bg-[#fcfaf6] pl-11 text-[#1f1812] placeholder:text-[#9f9383] focus-visible:ring-[#c9a227]"
              />
            </div>

            <FilterField label={dictionary.tournamentFilter || 'Filtrer par tournoi'}>
              <Select
                value={tournamentFilter}
                onChange={(event) => setTournamentFilter(event.target.value)}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1f1812] focus-visible:ring-[#c9a227]"
              >
                <option value="all">{dictionary.allTournaments || 'Tous les tournois'}</option>
                <option value="magistral">{dictionary.tournamentMagistral || 'Magistral'}</option>
                <option value="challenge">{dictionary.tournamentChallenge || 'Challenge'}</option>
                <option value="blitz">{dictionary.tournamentBlitz || 'Blitz'}</option>
              </Select>
            </FilterField>

            <FilterField label={dictionary.countryFilter || 'Filtrer par pays'}>
              <Input
                value={countryFilter}
                onChange={(event) => setCountryFilter(event.target.value)}
                placeholder={dictionary.country}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1f1812] placeholder:text-[#9f9383] focus-visible:ring-[#c9a227]"
              />
            </FilterField>

            <FilterField label={dictionary.companionFilter || 'Filtrer par accompagnants'}>
              <Select
                value={companionFilter}
                onChange={(event) => setCompanionFilter(event.target.value)}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1f1812] focus-visible:ring-[#c9a227]"
              >
                <option value="all">{dictionary.allCompanionStates || 'Tous'}</option>
                <option value="with">{dictionary.withCompanionsOnly || 'Avec accompagnants'}</option>
                <option value="without">{dictionary.soloPlayersOnly || 'Sans accompagnants'}</option>
              </Select>
            </FilterField>
          </div>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-[#d8ccb5] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#eadcc4] px-6 py-5">
            <h2 className="font-display text-3xl text-[#1f1812]">{dictionary.latestEntries}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d5448]">
              {dictionary.displayedRegistrations || 'Affichage'}: {filteredRows.length} / {rows.length}
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="rounded-[24px] border border-[#eadcc4] bg-[#fcfaf6] px-4 py-8 text-center text-[#5d5448]">
                {dictionary.loadingRegistrations}
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-[24px] border border-[#eadcc4] bg-[#fcfaf6] px-4 py-8 text-center text-[#5d5448]">
                {dictionary.noRows}
              </div>
            ) : (
              <div className="overflow-hidden rounded-[28px] border border-[#eadcc4] bg-[#fcfaf6]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[#5d5448]">{dictionary.firstName} / {dictionary.lastName}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.email}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.country}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.tournament}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.documents}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.companionsTitle || 'Accompagnants'}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.hotel}</TableHead>
                        <TableHead className="text-[#5d5448]">{dictionary.date}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.map((row) => {
                        const companions = normalizeCompanions(row.companions)
                        return (
                          <TableRow key={row.id} className="border-[#efe4d3] align-top hover:bg-white">
                            <TableCell className="min-w-[220px]">
                              <div className="font-semibold text-[#1f1812]">{row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim()}</div>
                              <div className="mt-2 text-xs leading-6 text-[#7f7364]">
                                {row.telephone || '—'}
                                {row.message ? <div className="mt-2 max-w-[260px] whitespace-pre-wrap text-[#5d5448]">{row.message}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[180px] text-[#433b30]">{row.email}</TableCell>
                            <TableCell className="text-[#433b30]">{row.country}</TableCell>
                            <TableCell>
                              <span className="inline-flex rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8e6717]">
                                {getTournamentLabel(row.tournament, dictionary)}
                              </span>
                            </TableCell>
                            <TableCell className="min-w-[220px]">
                              <DocumentPreview
                                title={dictionary.playerPassportPreview || 'Passeport joueur'}
                                path={row.personal_passport_path}
                                url={documentUrls[row.personal_passport_path]}
                                openLabel={dictionary.openDocument || 'Ouvrir'}
                                emptyLabel={dictionary.noDocument || 'Aucun document'}
                              />
                            </TableCell>
                            <TableCell className="min-w-[260px]">
                              {companions.length ? (
                                <div className="space-y-3">
                                  {companions.map((companion, index) => (
                                    <div key={`${row.id}-companion-${index}`} className="rounded-2xl border border-[#eadcc4] bg-white p-3">
                                      <p className="text-sm font-semibold text-[#1f1812]">{companion.full_name || `Companion ${index + 1}`}</p>
                                      <div className="mt-3">
                                        <DocumentPreview
                                          title={dictionary.companionPassports || 'Passeports accompagnants'}
                                          path={companion.passport_path}
                                          url={documentUrls[companion.passport_path]}
                                          openLabel={dictionary.openDocument || 'Ouvrir'}
                                          emptyLabel={dictionary.noDocument || 'Aucun document'}
                                          compact
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-[#8a7e6f]">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-[#433b30]">{row.hotel || '—'}</TableCell>
                            <TableCell className="text-[#433b30]">{formatWithLocale(row.created_at)}</TableCell>
                          </TableRow>
                        )
                      })}
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

function FilterField({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b6d5c]">{label}</span>
      {children}
    </label>
  )
}

function DocumentPreview({ title, path, url, openLabel, emptyLabel, compact = false }) {
  if (!path) {
    return <span className="text-sm text-[#8a7e6f]">{emptyLabel}</span>
  }

  if (!url) {
    return <span className="text-sm text-[#8a7e6f]">…</span>
  }

  const image = isImagePath(path)

  return (
    <div className={`rounded-[22px] border border-[#eadcc4] bg-white ${compact ? 'p-3' : 'p-4'}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b6d5c]">{title}</p>
      {image ? (
        <a href={url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-2xl border border-[#eadcc4] bg-[#fcfaf6] transition hover:border-[#c9a227]">
          <img src={url} alt={title} className={`w-full object-cover ${compact ? 'h-24' : 'h-32'}`} />
          <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-[#5d5448]">
            <span className="inline-flex items-center gap-2"><FileImage className="h-4 w-4" /> {openLabel}</span>
          </div>
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d8ccb5] px-4 py-2 text-sm font-semibold text-[#5d5448] transition hover:border-[#c9a227] hover:text-[#1f1812]"
        >
          <FileText className="h-4 w-4" />
          {openLabel}
        </a>
      )}
    </div>
  )
}
