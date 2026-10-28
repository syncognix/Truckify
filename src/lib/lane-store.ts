import { useSyncExternalStore } from 'react'

/**
 * The lane a visitor plotted on the map. Shared with the inquiry form so the
 * "Run this lane" CTA arrives with the lane pre-filled.
 */
let lane = ''
const listeners = new Set<() => void>()

export function setPlottedLane(value: string) {
  lane = value
  listeners.forEach((l) => l())
}

export function usePlottedLane() {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify)
      return () => listeners.delete(notify)
    },
    () => lane,
  )
}
