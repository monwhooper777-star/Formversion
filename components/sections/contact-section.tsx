"use client"

import Image from "next/image"
import { Mail, MapPin } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", email: "" })

    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center">
            {/* Heading */}
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
                Contact Monwhooper
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">
                / Get in touch with monwhooper to get your own Kangen Water® Machine
              </p>
            </div>

            {/* Email */}
            <a
              href="mailto:water@staydangerous.com"
              className={`group block transition-all duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="mb-1 flex items-center gap-2">
                <Mail className="h-3 w-3 text-foreground/60" />
                <span className="font-mono text-xs text-foreground/60">Email</span>
              </div>
              <p className="text-base text-foreground transition-colors group-hover:text-foreground/70 md:text-2xl">
                water@monwhooper.com
              </p>
            </a>

            {/* Location */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: "350ms" }}
            >
              <div className="mb-1 flex items-center gap-2">
                <MapPin className="h-3 w-3 text-foreground/60" />
                <span className="font-mono text-xs text-foreground/60">Location</span>
              </div>
              <p className="text-base text-foreground md:text-2xl">Los Angeles, CA</p>
            </div>

            {/* Socials + Avatar */}
            <div
              className={`flex items-center gap-4 pt-4 transition-all duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <Image
                src="/MWDP.png"
                alt="MWSD Profile"
                width={52}
                height={52}
                className="rounded-full"
              />

              <div className="flex flex-col">
                <a
                  href="https://x.com/MonWhooperA1776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-foreground/60 hover:text-foreground/90"
                >
                  Twitter
                </a>

                <a
                  href="https://www.instagram.com/monwhooper_amazing1776/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-foreground/60 hover:text-foreground/90"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – FORM */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                  Name<span className="text-red-500 pl-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                />
              </div>

              {/* EMAIL */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                  Email<span className="text-red-500 pl-1">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                />
              </div>

              {/* SUBMIT */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Upgrade Your Water"}
                </MagneticButton>

                {submitSuccess && (
                  <p className="mt-3 text-center font-mono text-sm text-foreground/80">
                    Message sent successfully!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
