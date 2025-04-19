import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createClient } from 'contentful-management';
import fs from 'fs';

// ⛔️ Viktigt: Inaktivera Next.js body parsing, eftersom formidable hanterar filen
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'Fel vid uppladdning.' });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      const client = createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
      });

      const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
      const env = await space.getEnvironment('master');

      // 1. Skapa upload från fil
      const upload = await env.createUpload({
        file: fs.readFileSync(file.filepath),
      });

      // 2. Skapa asset som pekar på upload
      const asset = await env.createAsset({
        fields: {
          title: {
            'en-US': file.originalFilename || 'Uploaded Image',
          },
          file: {
            'en-US': {
              contentType: file.mimetype || 'image/jpeg',
              fileName: file.originalFilename || 'file.jpg',
              uploadFrom: {
                sys: {
                  type: 'Link',
                  linkType: 'Upload',
                  id: upload.sys.id,
                },
              },
            },
          },
        },
      });

      // 3. Processa asset
      await asset.processForAllLocales();

      // 🔄 4. Hämta uppdaterad version innan publicering
      const updatedAsset = await env.getAsset(asset.sys.id);
      const publishedAsset = await updatedAsset.publish();

      // 5. Skicka tillbaka asset till frontend
      res.status(200).json({ asset: publishedAsset });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Något gick fel vid Contentful-upload.' });
    }
  });
}
