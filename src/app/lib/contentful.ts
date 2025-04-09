// lib/contentful.ts
import { createClient as createManagementClient } from 'contentful-management';
import { createClient as createDeliveryClient, Entry } from 'contentful';
import { ProductEntrySkeleton } from '../types/product';

const managementClient = createManagementClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

const deliveryClient = createDeliveryClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
});

export const getEnvironment = async () => {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  return space.getEnvironment('master');
};

// Nu hämtar vi entries med rätt SDK (delivery)
export const getProducts = async (): Promise<Entry<ProductEntrySkeleton>[]> => {
  const entries = await deliveryClient.getEntries<ProductEntrySkeleton>({
    content_type: 'product',
  });
  return entries.items;
};
