import { useEffect, useRef } from 'react'

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const el = ref.current
    if (el) {
      el.querySelectorAll('.reveal').forEach((node) => observer.observe(node))
    }

    return () => observer.disconnect()
  }, [])

  return ref
}
