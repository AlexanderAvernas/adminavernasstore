// types/product.ts

import { EntrySkeletonType } from 'contentful';

// Om du inte använder översättningar (localized fields är AV)
export interface ProductFields {
  name: string;
  slug: string;
  price: number;
  tax_rate: number;
  description: string;
  category: string;
  collection: string;
  image?: AssetReference;
  image1?: AssetReference;
  image2?: AssetReference;
  image3?: AssetReference;
}

// Typ för Contentful Media
interface AssetReference {
  fields: {
    file: {
      url: string;
    };
  };
}

// Skeleton som Contentful gillar
export type ProductEntrySkeleton = EntrySkeletonType<ProductFields, 'product'>;
