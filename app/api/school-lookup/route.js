import { NextResponse } from 'next/server'

const SCORECARD_FIELDS = [
  'id', 'school.name', 'school.state', 'school.city', 'school.ownership',
  'latest.student.size',
  'latest.admissions.admission_rate.overall',
  'latest.cost.tuition.in_state', 'latest.cost.tuition.out_of_state',
  'latest.cost.avg_net_price.overall',
  'latest.aid.pell_grant_rate', 'latest.aid.federal_loan_rate',
  'latest.aid.median_debt.completers.overall',
  'latest.completion.rate_suppressed.overall',
  'latest.earnings.6_yrs_after_entry.median',
  'latest.earnings.10_yrs_after_entry.median',
  'latest.student.share_firstgeneration',
  'latest.student.part_time_share',
].join(',')

function mapSchool(r) {
  return {
    id: r['id'],
    name: r['school.name'],
    city: r['school.city'],
    state: r['school.state'],
    ownership: r['school.ownership'],
    size: r['latest.student.size'],
    admission_rate: r['latest.admissions.admission_rate.overall'],
    tuition_in: r['latest.cost.tuition.in_state'],
    tuition_out: r['latest.cost.tuition.out_of_state'],
    net_price: r['latest.cost.avg_net_price.overall'],
    pell_rate: r['latest.aid.pell_grant_rate'],
    loan_rate: r['latest.aid.federal_loan_rate'],
    median_debt: r['latest.aid.median_debt.completers.overall'],
    completion_rate: r['latest.completion.rate_suppressed.overall'],
    earnings_6yr: r['latest.earnings.6_yrs_after_entry.median'],
    earnings_10yr: r['latest.earnings.10_yrs_after_entry.median'],
    firstgen_share: r['latest.student.share_firstgeneration'],
    part_time_share: r['latest.student.part_time_share'],
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const id = searchParams.get('id')

  if (!query && !id) {
    return NextResponse.json({ error: 'Provide q (search) or id (unitid)' }, { status: 400 })
  }

  const params = new URLSearchParams({
    api_key: 'DEMO_KEY',
    fields: SCORECARD_FIELDS,
    per_page: id ? '1' : '10',
  })

  if (id) {
    params.set('id', id)
  } else {
    params.set('school.name', query)
  }

  const res = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools.json?${params}`)
  const data = await res.json()
  const schools = (data.results || []).map(mapSchool)

  // Fetch peer comparison for specific school
  let peers = null
  if (id && schools.length > 0) {
    const school = schools[0]
    const sizeMin = Math.max(100, Math.floor((school.size || 1000) * 0.5))
    const sizeMax = Math.ceil((school.size || 1000) * 2)

    const peerParams = new URLSearchParams({
      api_key: 'DEMO_KEY',
      fields: SCORECARD_FIELDS,
      per_page: '100',
      'school.ownership': String(school.ownership),
      'latest.student.size__range': `${sizeMin}..${sizeMax}`,
    })

    const peerRes = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools.json?${peerParams}`)
    const peerData = await peerRes.json()

    if (peerData.results && peerData.results.length > 1) {
      const peerSchools = peerData.results
        .filter(p => p['id'] !== school.id)
        .map(mapSchool)
        .filter(p => p.completion_rate !== null)

      const avg = (arr, key) => {
        const valid = arr.filter(a => a[key] !== null && a[key] !== undefined).map(a => a[key])
        return valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null
      }
      const avgFloat = (arr, key) => {
        const valid = arr.filter(a => a[key] !== null && a[key] !== undefined).map(a => a[key])
        return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null
      }

      peers = {
        count: peerSchools.length,
        avg_completion: avgFloat(peerSchools, 'completion_rate'),
        avg_size: avg(peerSchools, 'size'),
        avg_net_price: avg(peerSchools, 'net_price'),
        avg_pell_rate: avgFloat(peerSchools, 'pell_rate'),
        avg_earnings_10yr: avg(peerSchools, 'earnings_10yr'),
        avg_median_debt: avg(peerSchools, 'median_debt'),
      }
    }
  }

  return NextResponse.json({ schools, peers })
}
