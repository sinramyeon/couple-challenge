import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabase'

const EMPTY_DAYS = Array(30).fill(false)

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { error }
  }

  const signInWithEmail = async (email) => {
    const redirectUrl = window.location.origin
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return { session, loading, signInWithGoogle, signInWithEmail, signOut }
}

export function useChallenge(session) {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  const myEmail = session?.user?.email?.toLowerCase()

  // Determine which side I am
  const mySide = challenge
    ? challenge.email_a?.toLowerCase() === myEmail ? 'a' : 'b'
    : null

  // Load my active challenge
  const loadChallenge = useCallback(async () => {
    if (!myEmail) return
    setLoading(true)

    const { data, error: err } = await supabase
      .from('challenges')
      .select('*')
      .or(`email_a.eq.${myEmail},email_b.eq.${myEmail}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (err) setError(err.message)
    else setChallenge(data)
    setLoading(false)
  }, [myEmail])

  useEffect(() => { loadChallenge() }, [loadChallenge])

  // Realtime subscription
  useEffect(() => {
    if (!challenge?.id) return

    channelRef.current = supabase
      .channel(`challenge-${challenge.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'challenges',
        filter: `id=eq.${challenge.id}`,
      }, (payload) => {
        setChallenge(prev => prev ? { ...prev, ...payload.new } : payload.new)
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'challenges',
        filter: `id=eq.${challenge.id}`,
      }, () => {
        setChallenge(null)
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [challenge?.id])

  // Refetch when app comes back to foreground (handles missed realtime events)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && challenge?.id) {
        loadChallenge()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [challenge?.id, loadChallenge])

  // Create a new challenge
  const createChallenge = async ({ name1, email1, name2, email2 }) => {
    const { data, error: err } = await supabase
      .from('challenges')
      .insert({
        email_a: email1.toLowerCase(),
        name_a: name1,
        email_b: email2.toLowerCase(),
        name_b: name2,
        goal_a: '',
        goal_b: '',
        days_a: EMPTY_DAYS,
        days_b: EMPTY_DAYS,
      })
      .select()
      .single()

    if (err) { setError(err.message); return null }
    setChallenge(data)
    return data
  }

  // Toggle a day
  const toggleDay = async (dayIndex) => {
    if (!challenge || !mySide) return
    const daysKey = `days_${mySide}`
    const newDays = [...challenge[daysKey]]
    newDays[dayIndex] = !newDays[dayIndex]

    // Optimistic update
    setChallenge(prev => ({ ...prev, [daysKey]: newDays }))

    const update = { [daysKey]: newDays }

    // Check for completion
    if (newDays.every(Boolean)) {
      update[`completed_${mySide}_at`] = new Date().toISOString()
    } else {
      update[`completed_${mySide}_at`] = null
    }

    const { data: updated, error: err } = await supabase
      .from('challenges')
      .update(update)
      .eq('id', challenge.id)
      .select()
      .maybeSingle()

    if (err || !updated) {
      // Revert on error or silent RLS failure
      if (err) setError(err.message)
      loadChallenge()
    }
  }

  // Update goal
  const updateGoal = async (newGoal) => {
    if (!challenge || !mySide) return
    const goalKey = `goal_${mySide}`

    setChallenge(prev => ({ ...prev, [goalKey]: newGoal }))

    const { data: updated, error: err } = await supabase
      .from('challenges')
      .update({ [goalKey]: newGoal })
      .eq('id', challenge.id)
      .select()
      .maybeSingle()

    if (err || !updated) {
      if (err) setError(err.message)
      loadChallenge()
    }
  }

  // Delete challenge (start fresh)
  const deleteChallenge = async () => {
    if (!challenge) return
    await supabase
      .from('challenges')
      .delete()
      .eq('id', challenge.id)
    setChallenge(null)
  }

  return {
    challenge,
    loading,
    error,
    mySide,
    createChallenge,
    toggleDay,
    updateGoal,
    deleteChallenge,
    reload: loadChallenge,
  }
}
