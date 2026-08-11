import { useEffect, useState } from 'react'

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatDate(date: Date) {
  const month = date.toLocaleString(undefined, { month: 'long' })
  const day = date.getDate()
  return `${month}, ${day}`
}

export default function Clock() {
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    setNow(new Date())

    // update at the start of each minute, then every 60s
    const update = () => setNow(new Date())
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds()

    const timeoutId = window.setTimeout(() => {
      update()
      const intervalId = window.setInterval(update, 60 * 1000)
      // store interval id on the timeout closure so we can clear it on unmount
      ;(timeoutId as unknown as { interval?: number }).interval = intervalId
    }, msUntilNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      // if interval was created, clear it as well
      // @ts-ignore - we stored it above dynamically
      if ((timeoutId as any).interval) window.clearInterval((timeoutId as any).interval)
    }
  }, [])

  return (
      <div className="clock-root clock-inline" aria-hidden style={{ display: 'flex', gap: '8px' }}>
        <span className="date">{formatDate(now)}</span>
        <span className="time">{formatTime(now)}</span>
    </div>
  )
}