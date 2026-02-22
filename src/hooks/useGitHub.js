import { useState, useCallback } from 'react'

const BASE = 'https://api.github.com'

export function useGitHub() {
  const [token, setToken] = useState(() => localStorage.getItem('gh_token') || '')
  const [rateLimit, setRateLimit] = useState(null)

  const headers = useCallback(() => {
    const h = { 'Accept': 'application/vnd.github+json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }, [token])

  const saveToken = (t) => {
    setToken(t)
    if (t) localStorage.setItem('gh_token', t)
    else localStorage.removeItem('gh_token')
  }

  const request = useCallback(async (path, params = {}) => {
    const url = new URL(`${BASE}${path}`)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    
    const res = await fetch(url.toString(), { headers: headers() })
    
    const remaining = res.headers.get('x-ratelimit-remaining')
    const limit = res.headers.get('x-ratelimit-limit')
    const reset = res.headers.get('x-ratelimit-reset')
    if (remaining !== null) {
      setRateLimit({ remaining: +remaining, limit: +limit, reset: +reset * 1000 })
    }

    if (res.status === 403) {
      const data = await res.json()
      throw new Error(data.message || 'Rate limit exceeded')
    }
    if (res.status === 404) throw new Error('Usuario no encontrado')
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || `HTTP ${res.status}`)
    }

    return res.json()
  }, [headers])

  const getUser = useCallback((username) => request(`/users/${username}`), [request])

  const getRepos = useCallback((username, page = 1, per_page = 30) =>
    request(`/users/${username}/repos`, { page, per_page, sort: 'updated', direction: 'desc' }),
    [request])

  const getCommits = useCallback((owner, repo, per_page = 10) =>
    request(`/repos/${owner}/${repo}/commits`, { per_page }),
    [request])

  const getLanguages = useCallback((owner, repo) =>
    request(`/repos/${owner}/${repo}/languages`),
    [request])

  return { token, saveToken, rateLimit, getUser, getRepos, getCommits, getLanguages }
}
