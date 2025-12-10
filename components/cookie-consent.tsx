"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "cookie-consent"

type ConsentValue = "accepted" | "declined"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setIsVisible(true)
    }
  }, [])

  const handleChoice = (value: ConsentValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
    setIsVisible(false)
  }

  const handleChangePreferences = () => {
    setIsVisible(true)
  }

  if (!isVisible) return null

  return (
    <div
      className="
        fixed bottom-0 inset-x-0 z-[9998]
        flex justify-center
        px-4 pb-6
        sm:px-6
        lg:justify-end lg:pr-12 lg:pb-10
      "
    >
      <div
        className="
          w-full max-w-lg lg:max-w-xl
          rounded-2xl border border-white/15
          bg-black/60 backdrop-blur-xl
          p-6 shadow-2xl text-white
        "
      >
        <h2 className="text-xl font-semibold">We use cookies</h2>

        <p className="mt-3 text-sm text-white/80 leading-relaxed">
          We use cookies and tracking technologies to improve your browsing experience,
          to show personalized content and targeted ads, to analyze website traffic,
          and to understand where our visitors are coming from.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            {/* Accept Button — white pill */}
            <Button
              className="
                w-full sm:w-auto
                bg-white text-black
                hover:bg-white/90
              "
              onClick={() => handleChoice("accepted")}
            >
              I agree
            </Button>

            {/* Decline Button */}
            <Button
              variant="outline"
              className="
                w-full sm:w-auto
                border-white/30 text-white hover:bg-white/10
              "
              onClick={() => handleChoice("declined")}
            >
              I decline
            </Button>
          </div>

          {/* Preferences Link */}
          <button
            type="button"
            onClick={handleChangePreferences}
            className="text-sm font-medium underline-offset-4 hover:underline text-white/80"
          >
            Change my preferences
          </button>
        </div>
      </div>
    </div>
  )
}
