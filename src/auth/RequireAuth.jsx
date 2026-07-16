// Route guard for pages that only mean anything when signed in (/profile,
// /checkout/success). While the session is resolving it renders a calm blank —
// the same choice App.jsx makes for the lazy course shell — so a signed-in
// learner never sees a flash of the login page on refresh.
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function RequireAuth({ children }) {
  const { loading, user } = useAuth()
  const { pathname, search } = useLocation()

  if (loading) return <div className="min-h-[50vh]" aria-busy="true" />
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(pathname + search)}`} replace />
  return children
}
