import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '../../../lib/contentful';

const locale = 'en-US';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const env = await getEnvironment();
  const entry = await env.getEntry(id);
  const fields = entry.fields;

  return NextResponse.json({
    id: entry.sys.id,
    name: fields.name?.[locale],
    slug: fields.slug?.[locale],
    price: fields.price?.[locale],
    description: fields.description?.[locale],
    category: fields.category?.[locale],
    collection: fields.collection?.[locale],
    image: fields.image?.[locale],
  });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const env = await getEnvironment();
  const data = await req.json();
  const entry = await env.getEntry(id);

  const fields: any = {};
  if (data.name) fields.name = { [locale]: data.name };
  if (data.slug) fields.slug = { [locale]: data.slug };
  if (data.price) fields.price = { [locale]: parseFloat(data.price) };
  if (data.description) fields.description = { [locale]: data.description };
  if (data.category) fields.category = { [locale]: data.category };
  if (data.collection) fields.collection = { [locale]: data.collection };
  if (data.image) fields.image = { [locale]: { sys: { type: 'Link', linkType: 'Asset', id: data.image } } };

  entry.fields = { ...entry.fields, ...fields };
  const updatedEntry = await entry.update();
  await updatedEntry.publish();

  return NextResponse.json({ message: 'Produkt uppdaterad' });
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const env = await getEnvironment();

  const entry = await env.getEntry(id);
  await entry.unpublish();
  await entry.delete();

  return NextResponse.json({ message: 'Produkt raderad' });
}

