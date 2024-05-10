import { auth } from 'app/auth';
import { USER_GSI, productDao } from '../../../backend/dao/dao';
import EmptyState from '@/components/dashboard/products/EmptyState';

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
  console.log('Products', products);
  // const session = {
  //   user: {
  //     name: 'Hai Le Gia',
  //     email: 'hailegia@gmail.com',
  //     image: 'https://avatars.githubusercontent.com/u/731508?v=4'
  //   },
  //   expires: '2024-06-06T17:37:56.980Z'
  // };
  return (
    <div>
      Projects
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
