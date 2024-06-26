import { auth } from 'app/auth';
import { USER_GSI, productDao } from '../../../backend/dao/dao';
import EmptyState from '@/components/dashboard/products/EmptyState';
import ProductsTableSection from '@/components/dashboard/products/ProductsTableSection';

export default async function Page() {
  const session = await auth();
  console.log(session);
  const userId = session.user.email;
  const products = await productDao.query({
    indexName: USER_GSI,
    hashKey: 'userId',
    hashValue: userId,
    rangeKey: 'classType',
    rangeValue: 'Product'
  });
  if (products.length === 0) {
    return (
      <>
        <EmptyState />;
      </>
    );
  }
  products.sort((a, b) => {
    return b.updatedAt - a.updatedAt;
  });
  products.forEach((product) => {
    product.downloadLink = `${process.env.BASE_URL}/api/product/data/${product.pk}`;
    if (product.photo) {
      product.image = `${process.env.BASE_URL}/api/product/photo/${product.photo}`;
    }
  });
  return (
    <>
      <ProductsTableSection products={products} />
    </>
  );
}
