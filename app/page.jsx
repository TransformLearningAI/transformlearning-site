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
import Waypoint   from '@/components/Waypoint'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <Waypoint label="the response" color="#0C1F3F" />
      <Solution />
      <Waypoint label="the model" color="#00A8A8" />
      <HowItWorks />
      <Courses />
      <Waypoint label="the proof" color="#4F8A5B" />
      <PilotModel />
      <Outcomes />
      <Waypoint label="get started" color="#00A8A8" />
      <Pricing />
      <About />
      <PilotForm />
      <Footer />
    </main>
  )
}
