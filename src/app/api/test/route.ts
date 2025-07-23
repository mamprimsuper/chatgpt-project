import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    openRouterConfigured: !!process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'not set',
    apiKeyLength: process.env.OPENROUTER_API_KEY?.length || 0,
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}