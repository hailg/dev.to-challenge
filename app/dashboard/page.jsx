import { auth } from 'app/auth';
import { userDao } from '../../backend/dao/dao';
import Summary from '@/components/dashboard/Summary';

export default async function Page() {
  const session = await auth();
  console.log(session);
  let user = await userDao.get(session.user.email, 'User');
  if (!user) {
    await userDao.create({
      pk: session.user.email,
      sk: 'User',
      name: session.user.name,
      image: session.user.image,
      productCount: 0,
      totalDownloadCount: 0
    });
    user = await userDao.get(session.user.email, 'User');
  }

  const stats = [
    { name: 'Total Products', stat: `${user.productCount ?? 0}` },
    { name: 'Total Download Count', stat: `${user.totalDownloadCount ?? 0}` }
  ];
  return (
    <>
      <Summary stats={stats} />
    </>
  );
}
