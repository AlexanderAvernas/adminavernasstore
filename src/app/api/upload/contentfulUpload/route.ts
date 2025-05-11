// src/app/api/upload/contentfulUploads/route.ts

import { NextRequest } from 'next/server';
import { createClient } from 'contentful-management';
import formidable from 'formidable';
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';

// Inaktivera Next.js bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const form = formidable({ multiples: false });

    const formData: { fields: any; files: any } = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = formData.files.file;

    const client = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const fileStream = createReadStream(file.filepath);

    const asset = await environment.createAssetFromFiles({
      fields: {
        title: {
          'en-US': file.originalFilename || 'Uploaded Image',
        },
        file: {
          'en-US': {
            contentType: file.mimetype,
            fileName: file.originalFilename,
            file: fileStream,
          },
        },
      },
    });

    await asset.processForAllLocales();
    await asset.waitWhileProcessing();

    const refreshedAsset = await environment.getAsset(asset.sys.id);
    const publishedAsset = await refreshedAsset.publish();

    return new Response(
      JSON.stringify({
        assetId: publishedAsset.sys.id,
        url: publishedAsset.fields.file['en-US'].url,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ message: 'Upload failed', error }), { status: 500 });
  }
}
