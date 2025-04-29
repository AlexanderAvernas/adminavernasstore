// import { NextRequest, NextResponse } from 'next/server';
// import { getEnvironment } from '../../../lib/contentful';

// const locale = 'en-US';

// export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
//   const { id } = await context.params;
//   const env = await getEnvironment();
//   const entry = await env.getEntry(id);
//   const fields = entry.fields;

//   return NextResponse.json({
//     id: entry.sys.id,
//     name: fields.name?.[locale],
//     slug: fields.slug?.[locale],
//     price: fields.price?.[locale],
//     description: fields.description?.[locale],
//     category: fields.category?.[locale],
//     collection: fields.collection?.[locale],
//     image: fields.image?.[locale],
//     image1: fields.image1?.[locale],
//     image2: fields.image2?.[locale],
//     image3: fields.image3?.[locale],
//   });
// }

// export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
//   const { id } = await context.params;
//   const env = await getEnvironment();
//   const data = await req.json();
//   const entry = await env.getEntry(id);

//   const fields: any = {};

//   if (data.name) fields.name = { [locale]: data.name };
//   if (data.slug) fields.slug = { [locale]: data.slug };
//   if (data.price) fields.price = { [locale]: parseFloat(data.price) };
//   if (data.description) fields.description = { [locale]: data.description };
//   if (data.category) fields.category = { [locale]: data.category };
//   if (data.collection) fields.collection = { [locale]: data.collection };

//   if (data.image) {
//     fields.image = { [locale]: { sys: { type: 'Link', linkType: 'Asset', id: data.image } } };
//   }
//   if (data.image1) {
//     fields.image1 = { [locale]: { sys: { type: 'Link', linkType: 'Asset', id: data.image1 } } };
//   }
//   if (data.image2) {
//     fields.image2 = { [locale]: { sys: { type: 'Link', linkType: 'Asset', id: data.image2 } } };
//   }
//   if (data.image3) {
//     fields.image3 = { [locale]: { sys: { type: 'Link', linkType: 'Asset', id: data.image3 } } };
//   }

//   entry.fields = { ...entry.fields, ...fields };

//   const updatedEntry = await entry.update();
//   await updatedEntry.publish();

//   return NextResponse.json({ message: 'Produkt uppdaterad' });
// }

// export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
//   const { id } = await context.params;
//   const env = await getEnvironment();

//   const entry = await env.getEntry(id);
//   await entry.unpublish();
//   await entry.delete();

//   return NextResponse.json({ message: 'Produkt raderad' });
// }

// 📄 app/api/product/[id]/route.ts

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
    image1: fields.image1?.[locale] || null,
    image2: fields.image2?.[locale] || null,
    image3: fields.image3?.[locale] || null,
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

  // Huvudbild – får ej raderas
  if (data.image) {
    fields.image = {
      [locale]: {
        sys: { type: 'Link', linkType: 'Asset', id: data.image },
      },
    };
  }

  // Extrabilder – får tas bort eller ändras
  ['image1', 'image2', 'image3'].forEach((key) => {
    if (data.hasOwnProperty(key)) {
      fields[key] = data[key]
        ? {
            [locale]: {
              sys: { type: 'Link', linkType: 'Asset', id: data[key] },
            },
          }
        : { [locale]: null };
    }
  });

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
