// src/app/api/contentful/asset/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '../../../../lib/contentful';

export async function GET(req: NextRequest, context: { params: any }) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Ogiltigt ID' }, { status: 400 });
    }

    const env = await getEnvironment();
    const asset = await env.getAsset(id);
    return NextResponse.json(asset);
  } catch (err: any) {
    console.error('Fel vid hämtning av asset:', err);
    return NextResponse.json({ error: 'Kunde inte hämta asset.' }, { status: 500 });
  }
}
