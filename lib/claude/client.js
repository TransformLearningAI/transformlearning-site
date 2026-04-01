import Anthropic from '@anthropic-ai/sdk'

let _client = null

export function getClient() {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

export const MODELS = {
  SMART: 'claude-sonnet-4-6',
  FAST:  'claude-haiku-4-5-20251001',
}
