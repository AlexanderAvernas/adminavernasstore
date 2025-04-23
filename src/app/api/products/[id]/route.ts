// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '../../../lib/contentful';

const locale = 'en-US';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const env = await getEnvironment();
  const entry = await env.getEntry(params.id);
  const fields = entry.fields;

  return NextResponse.json({
    name: fields.name?.[locale] || '',
    slug: fields.slug?.[locale] || '',
    price: fields.price?.[locale] || '',
    description: fields.description?.[locale] || '',
    category: fields.category?.[locale] || '',
    collection: fields.collection?.[locale] || '',
    image: fields.image?.[locale]?.sys?.id || '',
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const env = await getEnvironment();
  const data = await req.json();

  const entry = await env.getEntry(params.id);
  const fields: any = {};

  if (data.name) fields.name = { [locale]: data.name };
  if (data.slug) fields.slug = { [locale]: data.slug };
  if (data.price) fields.price = { [locale]: parseInt(data.price) };
  if (data.description) fields.description = { [locale]: data.description };
  if (data.category) fields.category = { [locale]: data.category };
  if (data.collection) fields.collection = { [locale]: data.collection };

  // Säker hantering av image-id oavsett format
  if (data.image) {
    const imageId =
      typeof data.image === 'string'
        ? data.image
        : data.image?.sys?.id || data.image?.id || '';

    if (imageId) {
      fields.image = {
        [locale]: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: imageId,
          },
        },
      };
    }
  }

  Object.assign(entry.fields, fields);
  const updated = await entry.update();
  await updated.publish();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const env = await getEnvironment();
  const entry = await env.getEntry(params.id);
  await entry.unpublish().catch(() => {});
  await entry.delete();

  return NextResponse.json({ success: true });
}
