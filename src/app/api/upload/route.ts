// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '../../lib/contentful';

export async function POST(req: NextRequest) {
  const env = await getEnvironment();
  const data = await req.formData();
  const file = data.get('file') as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const asset = await env.createAsset({
    fields: {
      title: { 'en-US': file.name },
      file: {
        'en-US': {
          contentType: file.type,
          fileName: file.name,
          content: buffer,
        },
      },
    },
  });

  const processed = await asset.processForAllLocales();
  const published = await processed.publish();

  return NextResponse.json({ assetId: published.sys.id });
}
