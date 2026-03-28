import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProtectedAdminRoute({ children }) {
  const { dictionary } = useLanguage()
  const [state, setState] = useState({ loading: true, allowed: false })

  useEffect(() => {
    let ignore = false

    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        if (!ignore) setState({ loading: false, allowed: false })
        return
      }

      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!ignore) {
        setState({ loading: false, allowed: Boolean(data) })
      }
    }

    checkAccess()
    return () => {
      ignore = true
    }
  }, [])

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
          {dictionary.checkingAccess}
        </div>
      </div>
    )
  }

  if (!state.allowed) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
