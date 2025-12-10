"use client"

import Image from "next/image"
import { useRef, useEffect, useState } from "react"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { DemoSection } from "@/components/sections/demo-section"
import { MagneticButton } from "@/components/magnetic-button"

const TOTAL_SECTIONS = 6 // 0..5 → Hero, Work, Services, Demo, About, Contact

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()

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
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
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

  // Touch scroll (vertical swipes -> horizontal scroll)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < TOTAL_SECTIONS - 1) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  // Mouse wheel scroll (vertical -> horizontal)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
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
  }, [currentSection])

  // Sync currentSection with scrollLeft
  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (
          newSection !== currentSection &&
          newSection >= 0 &&
          newSection <= TOTAL_SECTIONS - 1
        ) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  const navItems = ["Home", "Features", "Feat. Cont.", "Demo.", "About", "Contact"]

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
          {/* RED / BLACK SWIRL BASE */}
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

          {/* CHROMA FLOW FOR WHITE FLASHES + RED MOVEMENT */}
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
          onClick={() => scrollToSection(3)}
          className="px-4 py-1 text-xs md:px-6 md:py-2 md:text-sm"
        >
          Product Demo.
        </MagneticButton>
      </nav>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* HERO SECTION */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-4 pb-14 pt-24 md:px-12 md:pb-24">
          <div className="max-w-3xl">
            {/* Japanese type + pill */}
            <div className="mb-3 flex flex-col items-start gap-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Image
                src="/japtype.png"
                alt="Electrolyzed Water - Japanese"
                width={90}
                height={24}
                priority
                className="object-contain opacity-95 md:w-[110px]"
              />

              <div className="inline-block rounded-full border border-foreground/20 bg-foreground/15 px-3 py-1 backdrop-blur-md">
                <p className="font-mono text-[10px] text-foreground/90 md:text-xs">
                  Electrolyzed Water Technology
                </p>
              </div>
            </div>

            {/* HERO */}
            <h1 className="mb-5 animate-in fade-in slide-in-from-bottom-8 font-dxgotha text-4xl font-light leading-tight tracking-tight text-foreground duration-1000 sm:text-5xl md:mb-6 md:text-7xl md:leading-[1.1] lg:text-8xl">
              <span className="text-balance">Stay Dangerous</span>
            </h1>

            {/* SUBCOPY */}
            <p className="mb-6 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-foreground/90 duration-1000 delay-200 md:mb-8 md:text-xl">
              <span className="text-pretty">
                Hydration engineered for resilience, clarity, and dangerous longevity. Water that sharpens the body,
                fortifies the mind, and amplifies human potential.
              </span>
            </p>

            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton
                size="lg"
                variant="secondary"
                className="w-full text-sm sm:w-auto md:text-base"
                onClick={() => scrollToSection(3)}
              >
                View Demo
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500 md:bottom-8">
            <div className="flex items-center gap-2">
              <p className="font-mono text-[10px] text-foreground/80 md:text-xs">
                Scroll to explore
              </p>
              <div className="flex h-5 w-10 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md md:h-6 md:w-12">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/80 md:h-2 md:w-2" />
              </div>
            </div>
          </div>
        </section>

        {/* OTHER SECTIONS */}
        <WorkSection />
        <ServicesSection />
        <DemoSection scrollToSection={scrollToSection} />
        <AboutSection scrollToSection={scrollToSection} />
        <ContactSection />
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
