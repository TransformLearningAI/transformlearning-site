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
import Milestone   from '@/components/Milestone'

export default function Home() {
  return (
    <main id="main-content">
      <Nav />
      <Hero />
      <Problem />
      <Milestone label="the response" color="#0C1F3F" />
      <Solution />
      <Milestone label="the model" color="#00A8A8" />
      <HowItWorks />
      <Courses />
      <Milestone label="the proof" color="#4F8A5B" />
      <PilotModel />
      <Outcomes />
      <Milestone label="get started" color="#00A8A8" />
      <Pricing />
      <About />
      <PilotForm />
      <Footer />
    </main>
  )
}
