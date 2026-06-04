import CampusNav from '@/components/CampusNav'

export default function CampusTransformationLayout({ children }) {
  return (
    <>
      <CampusNav />
      {children}
    </>
  )
}
