import Nav        from '@/components/Nav'
import Hero       from '@/components/Hero'
import Problem    from '@/components/Problem'
import Solution   from '@/components/Solution'
import HowItWorks from '@/components/HowItWorks'
import Courses    from '@/components/Courses'
import PilotModel from '@/components/PilotModel'
import Outcomes   from '@/components/Outcomes'
import Pricing    from '@/components/Pricing'
import About      from '@/components/About'
import PilotForm  from '@/components/PilotForm'
import Footer     from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Courses />
      <PilotModel />
      <Outcomes />
      <Pricing />
      <About />
      <PilotForm />
      <Footer />
    </main>
  )
}
