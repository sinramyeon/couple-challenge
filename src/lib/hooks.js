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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
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

  const mySide = challenge
    ? challenge.email_a?.toLowerCase() === myEmail ? 'a' : 'b'
    : null

  const otherSide = mySide === 'a' ? 'b' : 'a'

  // ─── Load challenge ───
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

  // ─── Realtime subscription ───
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

  // Refetch on foreground
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible' && challenge?.id) loadChallenge()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [challenge?.id, loadChallenge])

  // ─── Create challenge ───
  const createChallenge = async ({ name1, email1, name2, email2 }) => {
    const { data, error: err } = await supabase
      .from('challenges')
      .insert({
        email_a: email1.toLowerCase(),
        name_a: name1,
        email_b: email2.toLowerCase(),
        name_b: name2,
        goal_a: '', goal_b: '',
        days_a: EMPTY_DAYS, days_b: EMPTY_DAYS,
        // Phase 2 fields (nullable, gracefully degrades if columns don't exist)
        note_a: '', note_b: '',
        mood_a: '', mood_b: '',
        skin_a: 'stripe', skin_b: 'stripe',
      })
      .select()
      .single()

    if (err) { setError(err.message); return null }
    setChallenge(data)
    return data
  }

  // ─── Toggle day ───
  const toggleDay = async (dayIndex) => {
    if (!challenge || !mySide) return
    const daysKey = `days_${mySide}`
    const newDays = [...challenge[daysKey]]
    newDays[dayIndex] = !newDays[dayIndex]

    setChallenge(prev => ({ ...prev, [daysKey]: newDays }))

    const update = { [daysKey]: newDays }
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
      if (err) setError(err.message)
      loadChallenge()
    }
  }

  // ─── Update goal ───
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

  // ─── Phase 2: Update daily note ───
  const updateNote = async (note) => {
    if (!challenge || !mySide) return
    const noteKey = `note_${mySide}`
    setChallenge(prev => ({ ...prev, [noteKey]: note }))

    const { error: err } = await supabase
      .from('challenges')
      .update({ [noteKey]: note })
      .eq('id', challenge.id)

    if (err) {
      console.warn('Note update failed (column may not exist yet):', err.message)
      // Graceful degradation — doesn't break the app
    }
  }

  // ─── Phase 2: Update mood ───
  const updateMood = async (mood) => {
    if (!challenge || !mySide) return
    const moodKey = `mood_${mySide}`
    setChallenge(prev => ({ ...prev, [moodKey]: mood }))

    const { error: err } = await supabase
      .from('challenges')
      .update({ [moodKey]: mood })
      .eq('id', challenge.id)

    if (err) console.warn('Mood update failed:', err.message)
  }

  // ─── Phase 2: Send nudge ───
  // Saves to DB (so partner sees it even if offline) + broadcast for real-time
  const sendNudge = async () => {
    if (!challenge?.id || !mySide) return

    // Save to DB so partner sees it when they open the app
    const nudgeKey = `last_nudge_${mySide}`
    await supabase
      .from('challenges')
      .update({ [nudgeKey]: new Date().toISOString() })
      .eq('id', challenge.id)

    // Also broadcast for instant delivery if partner is online
    const ch = supabase.channel(`nudge-${challenge.id}`)
    await ch.send({
      type: 'broadcast',
      event: 'nudge',
      payload: { from: mySide, name: challenge[`name_${mySide}`] },
    })
    supabase.removeChannel(ch)
  }

  // ─── Phase 2: Send reaction ───
  const sendReaction = async (emoji) => {
    if (!challenge?.id || !mySide) return
    const ch = supabase.channel(`reaction-${challenge.id}`)
    await ch.send({
      type: 'broadcast',
      event: 'reaction',
      payload: { from: mySide, name: challenge[`name_${mySide}`], emoji },
    })
    supabase.removeChannel(ch)
  }

  // ─── Phase 2: Listen for nudges & reactions ───
  const [incomingInteraction, setIncomingInteraction] = useState(null)
  const nudgeCheckedRef = useRef(false)

  // Check DB for pending nudge on load / foreground
  useEffect(() => {
    if (!challenge?.id || !mySide || nudgeCheckedRef.current) return
    nudgeCheckedRef.current = true

    const otherNudgeKey = `last_nudge_${mySide === 'a' ? 'b' : 'a'}`
    const otherName = challenge[`name_${mySide === 'a' ? 'b' : 'a'}`]
    const nudgeTime = challenge[otherNudgeKey]

    if (nudgeTime) {
      setIncomingInteraction({ type: 'nudge', name: otherName, id: Date.now() })
      // Clear the nudge in DB so it doesn't show again
      supabase
        .from('challenges')
        .update({ [otherNudgeKey]: null })
        .eq('id', challenge.id)
        .then(() => {})
    }
  }, [challenge?.id, mySide])

  // Reset nudge check on foreground return
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        nudgeCheckedRef.current = false
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  // Real-time broadcast (instant when both online)
  useEffect(() => {
    if (!challenge?.id || !mySide) return

    const nudgeCh = supabase
      .channel(`nudge-${challenge.id}`)
      .on('broadcast', { event: 'nudge' }, ({ payload }) => {
        if (payload.from !== mySide) {
          setIncomingInteraction({
            type: 'nudge', name: payload.name,
            id: Date.now(),
          })
          // Clear DB nudge since we already showed it
          const otherNudgeKey = `last_nudge_${payload.from}`
          supabase
            .from('challenges')
            .update({ [otherNudgeKey]: null })
            .eq('id', challenge.id)
            .then(() => {})
        }
      })
      .subscribe()

    const reactCh = supabase
      .channel(`reaction-${challenge.id}`)
      .on('broadcast', { event: 'reaction' }, ({ payload }) => {
        if (payload.from !== mySide) {
          setIncomingInteraction({
            type: 'reaction', name: payload.name, emoji: payload.emoji,
            id: Date.now(),
          })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(nudgeCh)
      supabase.removeChannel(reactCh)
    }
  }, [challenge?.id, mySide])

  const clearInteraction = useCallback(() => setIncomingInteraction(null), [])

  // ─── Phase 1: Update skin preference ───
  const updateSkin = async (skinId) => {
    if (!challenge || !mySide) return
    const skinKey = `skin_${mySide}`
    setChallenge(prev => ({ ...prev, [skinKey]: skinId }))

    const { error: err } = await supabase
      .from('challenges')
      .update({ [skinKey]: skinId })
      .eq('id', challenge.id)

    if (err) console.warn('Skin update failed:', err.message)
  }

  // ─── Delete challenge ───
  const deleteChallenge = async () => {
    if (!challenge) return
    await supabase.from('challenges').delete().eq('id', challenge.id)
    setChallenge(null)
  }

  // ─── Restart challenge (keep XP, reset days) ───
  const restartChallenge = async (currentCoupleXP) => {
    if (!challenge) return
    const bankedXP = (challenge.banked_xp || 0) + currentCoupleXP

    // Try with banked_xp first, fallback without it if column doesn't exist
    let updatePayload = {
      days_a: EMPTY_DAYS,
      days_b: EMPTY_DAYS,
      goal_a: '',
      goal_b: '',
      completed_a_at: null,
      completed_b_at: null,
      banked_xp: bankedXP,
    }

    let { data: updated, error: err } = await supabase
      .from('challenges')
      .update(updatePayload)
      .eq('id', challenge.id)
      .select()
      .maybeSingle()

    // If banked_xp column doesn't exist yet, retry without it
    if (err && err.message?.includes('banked_xp')) {
      const { banked_xp, ...fallback } = updatePayload
      const res = await supabase
        .from('challenges')
        .update(fallback)
        .eq('id', challenge.id)
        .select()
        .maybeSingle()
      updated = res.data
      err = res.error
    }

    if (err) {
      setError(err.message)
    } else if (updated) {
      setChallenge(updated)
    }
  }

  return {
    challenge,
    loading,
    error,
    mySide,
    otherSide,
    createChallenge,
    toggleDay,
    updateGoal,
    deleteChallenge,
    restartChallenge,
    reload: loadChallenge,
    // Phase 1
    updateSkin,
    // Phase 2
    updateNote,
    updateMood,
    sendNudge,
    sendReaction,
    incomingInteraction,
    clearInteraction,
  }
}