import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '../../lib/contentful';

const locale = 'en-US';

export async function POST(req: NextRequest) {
  try {
    const env = await getEnvironment();
    const data = await req.json();

    const parsedPrice = parseInt(data.price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ success: false, error: "Ogiltigt pris" }, { status: 400 });
    }

    const entry = await env.createEntry('product', {
      fields: {
        name: { [locale]: data.name },
        slug: { [locale]: data.slug },
        price: { [locale]: parsedPrice },
        description: { [locale]: data.description },
        category: { [locale]: data.category },
        collection: { [locale]: data.collection },
        ...(data.image && {
          image: {
            [locale]: {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: data.image,
              },
            },
          },
        }),
      },
    });

    await entry.publish();

    return NextResponse.json({ success: true, entryId: entry.sys.id });
  } catch (err: any) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
