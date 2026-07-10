import { useEffect, useState } from "react"

// Rivela `text` carattere per carattere quando `active` diventa true.
// Con prefers-reduced-motion il testo compare per intero, istantaneamente.
// `resetKey`: cambiandolo si forza una nuova digitazione da capo, anche se
// `active` resta true (usato per il pulsante "rileggi").
export function useTypewriter(text, active, { speed = 20, resetKey = 0 } = {}) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active || !text) return
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setDisplayed(text)
      setDone(true)
      return
    }
    let i = 0
    setDisplayed("")
    setDone(false)
    const id = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, active, speed, resetKey])

  return { displayed, done }
}
