// // app/admin/products/page.tsx
// import { getProducts } from '../../lib/contentful';
// import { ProductEntrySkeleton } from '../../types/product';
// import { Entry } from 'contentful';
// import Link from 'next/link';

// export default async function AdminProducts() {
//   const products: Entry<ProductEntrySkeleton>[] = await getProducts();

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Produkter</h1>
//         <Link href="/admin/products/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//           + Ny produkt
//         </Link>
//       </div>
//       <div className="grid gap-4">
//         {products.map((product) => (
//           <div key={product.sys.id} className="bg-white shadow p-4 rounded-lg">
//             <h2 className="text-xl font-semibold">{product.fields.name}</h2>
//             <p className="text-sm text-gray-600">{product.fields.description}</p>
//             <p className="text-sm font-medium text-gray-800">{product.fields.price} kr</p>

//             {product.fields.image && (
//               <img
//                 src={`https:${product.fields.image.fields.file.url}`}
//                 alt={product.fields.name}
//                 className="w-32 h-32 object-cover rounded mt-2"
//               />
//             )}

//             <Link
//               href={`/admin/products/${product.sys.id}/edit`}
//               className="text-blue-600 text-sm mt-2 inline-block"
//             >
//               Redigera
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';

import { getProducts } from '../../lib/contentful';
import { ProductEntrySkeleton } from '../../types/product';
import { Entry } from 'contentful';
import AdminProductsPageClient from '../../components/admin/AdminProductsPageClient';

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const products: Entry<ProductEntrySkeleton>[] = await getProducts();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminProductsPageClient products={products} />
    </div>
  );
}
