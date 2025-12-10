"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* LEFT SIDE */}
          <div>
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-3 font-sans text-3xl font-light leading-[1.1] tracking-tight text-foreground md:mb-4 md:text-6xl lg:text-7xl">
                Kenneth
                <br />
                Castaneda
                <br />
                <span className="text-foreground/40">MWSD</span>
              </h2>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 md:space-y-4 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                Monwhooper1776 - Stay Dangerous is a personal brand created by Kenneth Castenada, the maxim "Stay Dangerous" encapsulates the main philosophy of the brand.
              </p>
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                If you are here then you are well aware that the core and central offer being put front and centre is electrolyzed reduced water provided by Kangen Water® Machines that are engineered by a company called Enagic® of which Kenneth is a Product Distributor for.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE STATS */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-12">
            {[
              { value: "23+", label: "Countries", sublabel: "Enagic® has presence in", direction: "right" },
              { value: "51", label: "Years", sublabel: "Enagic® has been in Business", direction: "left" },
              { value: "9", label: "Certifications", sublabel: "Enagic® has received for Quality Assurance", direction: "right" },
            ].map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return stat.direction === "left"
                    ? "-translate-x-16 opacity-0"
                    : "translate-x-16 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`flex items-baseline gap-4 border-l border-foreground/30 pl-4 transition-all duration-700 md:gap-8 md:pl-8 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${300 + i * 150}ms`,
                    marginLeft: i % 2 === 0 ? "0" : "auto",
                    maxWidth: i % 2 === 0 ? "100%" : "85%",
                  }}
                >
                  <div className="text-3xl font-light text-foreground md:text-6xl lg:text-7xl">
                    {stat.value}
                  </div>
                  <div>
                    <div className="font-sans text-base font-light text-foreground md:text-xl">
                      {stat.label}
                    </div>
                    <div className="font-mono text-xs text-foreground/60">
                      {stat.sublabel}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA — slightly smaller Product Demo button */}
        <div
          className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 md:mt-16 md:gap-4 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "750ms" }}
        >
          <MagneticButton
            size="md"  // ← changed from lg to md
            variant="primary"
            onClick={() => scrollToSection?.(3)}
            className="px-6 py-2 text-sm md:text-base" // ← tightened padding & font size
          >
            View Product Demo.
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
