import { Navbar }        from "@/components/Navbar"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { Hero }           from "@/components/sections/Hero"
import { Showcase }       from "@/components/sections/Showcase"
import { Stats }          from "@/components/sections/Stats"
import { Problem }        from "@/components/sections/Problem"
import { Services }       from "@/components/sections/Services"
import { HowItWorks }     from "@/components/sections/HowItWorks"
import { Testimonials }   from "@/components/sections/Testimonials"
import { FAQ }            from "@/components/sections/FAQ"
import { FinalCTA }       from "@/components/sections/FinalCTA"
import { Footer }         from "@/components/sections/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Stats />
        <Problem />
        <Services />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
