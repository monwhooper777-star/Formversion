"use client"

import type React from "react"
import Image from "next/image"
import { useRef, useEffect, useState, useCallback } from "react"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"

// ---------- FORM CONFIG (Kangen / Enagic specific) ----------

type FormData = {
  name: string
  email: string
  goal: string
  currentSituation: string
  useCase: string
  budget: string
}

type StepField = {
  name: keyof FormData
  label: string
  placeholder?: string
  type?: "text" | "email" | "textarea"
  required?: boolean
}

type Step = {
  id: number
  title: string
  subtitle?: string
  fields: StepField[]
}

const steps: Step[] = [
  {
    id: 1,
    title: "Who’s thinking about upgrading their water?",
    subtitle:
      "Greetings, friend. Before we take further steps to improve your water quality, what is your name?",
    fields: [
      {
        name: "name",
        label: "Name",
        placeholder: "John Doe",
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: "Where can I send everything?",
    subtitle:
      "I’ll use this to send you details, demos, and a breakdown of which Kangen options make sense for you. No spam.",
    fields: [
      {
        name: "email",
        label: "Best email",
        placeholder: "you@example.com",
        type: "email",
        required: true,
      },
    ],
  },
  {
    id: 3,
    title: "Why are you looking into Kangen water?",
    subtitle:
      "Everyone has a different reason—health, recovery, family, performance, business. What made you start looking?",
    fields: [
      {
        name: "goal",
        label: "Main reason you’re looking into it",
        placeholder:
          "e.g. energy & recovery, family health, anti-ageing / skin, replacing bottled water, adding value to a clinic or gym…",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: 4,
    title: "What’s your water situation right now?",
    subtitle:
      "Tap, bottled, filter, RO, another ionizer—this helps me compare things properly for you.",
    fields: [
      {
        name: "currentSituation",
        label: "Current setup",
        placeholder:
          "e.g. supermarket bottled water, basic under-sink filter, RO system, sharehouse tap, already tried another brand of ionizer…",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: 5,
    title: "Where do you want Kangen water in your life?",
    subtitle:
      "Home, family, office, clinic, gym—the use-case affects which machine is the best fit.",
    fields: [
      {
        name: "useCase",
        label: "Primary use-case & who it’s for",
        placeholder:
          "e.g. home use for 2 adults + 2 kids, clinic clients, gym members, office staff, content/testing only…",
        required: true,
      },
    ],
  },
  {
    id: 6,
    title: "What kind of investment range are you considering?",
    subtitle:
      "This isn’t a commitment—it just helps me point you toward the right model and payment options.",
    fields: [
      {
        name: "budget",
        label: "Budget range",
        placeholder:
          "e.g. 3–4k, 4–6k, higher if it makes sense, would need a payment plan, not sure yet…",
        required: true,
      },
    ],
  },
]

const navItems = [
  "You",
  "Contact",
  "Why Kangen?",
  "Current Water",
  "Use-case",
  "Budget",
]

const TOTAL_SECTIONS = steps.length

const initialFormData: FormData = {
  name: "",
  email: "",
  goal: "",
  currentSituation: "",
  useCase: "",
  budget: "",
}

// ---------- PAGE ----------

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(0)

  // Wait for shader canvas to be ready
  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) clearInterval(intervalId)
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (!scrollContainerRef.current) return

    const clampedIndex = Math.max(0, Math.min(TOTAL_SECTIONS - 1, index))
    const sectionWidth = scrollContainerRef.current.offsetWidth

    scrollContainerRef.current.scrollTo({
      left: sectionWidth * clampedIndex,
      behavior: "smooth",
    })

    setCurrentSection(clampedIndex)
  }

  const isStepValid = useCallback(
    (index: number) => {
      const step = steps[index]
      return step.fields.every((field) => {
        if (!field.required) return true
        const value = formData[field.name]
        return value && value.toString().trim().length > 0
      })
    },
    [formData]
  )

  const handleFieldChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const goNext = () => {
    if (!isStepValid(currentSection)) return
    if (currentSection < TOTAL_SECTIONS - 1) {
      scrollToSection(currentSection + 1)
    }
  }

  const goBack = () => {
    if (currentSection > 0) {
      scrollToSection(currentSection - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isStepValid(currentSection)) return
    setIsSubmitting(true)
    try {
      // TODO: hook into /api/lead + Resend / DB
      console.log("Submitting Kangen interest:", formData)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsSubmitted(true)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Touch scroll: vertical swipes → step navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          goNext()
        } else {
          goBack()
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection, goNext, goBack])

  // Mouse wheel: vertical → step navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        const now = Date.now()
        if (now - lastScrollTime < 600) return // throttle

        setLastScrollTime(now)

        if (e.deltaY > 0) {
          goNext()
        } else if (e.deltaY < 0) {
          goBack()
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection, goNext, goBack, lastScrollTime])

  // Press Enter to continue
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (currentSection === TOTAL_SECTIONS - 1) {
        void handleSubmit()
      } else {
        goNext()
      }
    }
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      {/* Shader background */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#000000"
            colorB="#8b0000"
            speed={0.65}
            detail={0.9}
            blend={55}
            coarseX={35}
            coarseY={35}
            mediumX={40}
            mediumY={40}
            fineX={45}
            fineY={45}
          />
          <ChromaFlow
            baseColor="#0a0a0a"
            upColor="#ffffff"
            downColor="#8b0000"
            leftColor="#ff1a1a"
            rightColor="#ff1a1a"
            intensity={1.1}
            radius={2.0}
            momentum={32}
            maskType="alpha"
            opacity={0.92}
          />
        </Shader>

        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-opacity duration-700 md:px-12 md:py-6 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="h-9 w-9 overflow-hidden rounded-lg transition-all duration-300 hover:scale-110 md:h-10 md:w-10">
            <Image
              src="/MWSDlogo.png"
              alt="MWSD Logo"
              width={40}
              height={40}
              className="object-cover"
              priority
            />
          </div>

          <span className="font-sans text-lg font-semibold tracking-tight text-foreground md:text-xl">
            MWSD
          </span>
        </button>

        <div className="hidden items-center gap-6 md:flex md:gap-8">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-xs font-medium transition-colors md:text-sm ${
                currentSection === index
                  ? "text-foreground"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton
          variant="secondary"
          onClick={() => scrollToSection(0)}
          className="px-4 py-1 text-xs md:px-6 md:py-2 md:text-sm"
        >
          Product Demo.
        </MagneticButton>
      </nav>

      {/* HORIZONTAL STEP CONTAINER */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-hidden overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Thank-you screen after submission */}
        {isSubmitted ? (
          <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center px-4 pb-14 pt-24 md:px-12 md:pb-24">
            <div className="max-w-3xl space-y-6">
              <h1 className="font-dxgotha text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Stay Dangerous. I’ll take it from here.
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-foreground/90 md:text-base">
                Your answers are in. I’ll review everything personally and send you a tailored
                breakdown of the Kangen options that fit your situation—plus demos, comparisons,
                and clear next steps.
              </p>
            </div>
          </section>
        ) : (
          <>
            {steps.map((step, index) => {
              const isLast = index === TOTAL_SECTIONS - 1
              const stepValid = isStepValid(index)

              return (
                <section
                  key={step.id}
                  className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-4 pb-14 pt-24 md:px-12 md:pb-24"
                >
                  <div className="max-w-3xl">
                    {/* STEP CONTENT */}
                    <div className="space-y-4">
                      <p className="text-xs font-medium tracking-[0.3em] text-foreground/60">
                        {step.id} → {TOTAL_SECTIONS}
                      </p>

                      <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
                        {step.title}
                      </h2>

                      {step.subtitle && (
                        <p className="max-w-xl text-sm leading-relaxed text-foreground/80 md:text-base">
                          {step.subtitle}
                        </p>
                      )}

                      <div className="mt-6 space-y-6">
                        {step.fields.map((field) => {
                          const value = formData[field.name] as string
                          const isTextArea = field.type === "textarea"
                          const invalid = field.required && !value.trim()

                          return (
                            <div key={field.name} className="space-y-2">
                              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
                                {field.label}
                                {field.required && (
                                  <span className="ml-1 text-red-400">*</span>
                                )}
                              </label>

                              {isTextArea ? (
                                <textarea
                                  rows={4}
                                  className={`w-full rounded-2xl border border-foreground/25 bg-black/40 px-4 py-3 text-sm text-foreground outline-none backdrop-blur-sm transition focus:border-foreground/60 focus:bg-black/60 ${
                                    invalid ? "border-red-500/70" : ""
                                  }`}
                                  value={value}
                                  placeholder={field.placeholder}
                                  onChange={(e) =>
                                    handleFieldChange(field.name, e.target.value)
                                  }
                                />
                              ) : (
                                <input
                                  type={field.type ?? "text"}
                                  className={`h-12 w-full rounded-2xl border border-foreground/25 bg-black/40 px-4 text-sm text-foreground outline-none backdrop-blur-sm transition focus:border-foreground/60 focus:bg-black/60 ${
                                    invalid ? "border-red-500/70" : ""
                                  }`}
                                  value={value}
                                  placeholder={field.placeholder}
                                  onChange={(e) =>
                                    handleFieldChange(field.name, e.target.value)
                                  }
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="mt-10 flex items-center justify-between">
                      <button
                        onClick={goBack}
                        disabled={index === 0}
                        className="text-xs font-medium text-foreground/60 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ← Back
                      </button>

                      <div className="flex items-center gap-3">
                        <p className="hidden text-xs text-foreground/60 sm:inline">
                          Press <span className="font-mono">Enter</span> to continue
                        </p>

                        {isLast ? (
                          <MagneticButton
                            as="button"
                            onClick={handleSubmit}
                            disabled={!stepValid || isSubmitting}
                            className="rounded-full px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
                          >
                            {isSubmitting ? "Sending…" : "Submit"}
                          </MagneticButton>
                        ) : (
                          <MagneticButton
                            as="button"
                            onClick={goNext}
                            disabled={!stepValid}
                            className="rounded-full px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
                          >
                            Next
                          </MagneticButton>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </>
        )}
      </div>

      {/* Hide scrollbars globally */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
