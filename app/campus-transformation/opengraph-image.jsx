import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Campus Transformation — Don\'t Close. Transform.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0C1F3F 0%, #1a3a6b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          Don't Close. Transform.
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#00A8A8',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          Turn your closing campus into a workforce center, community hub, and sustainable operation.
        </div>
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            marginTop: '40px',
          }}
        >
          transformlearning.ai/campus-transformation
        </div>
      </div>
    ),
    { ...size }
  )
}
