import { auth } from 'app/auth';
import { userDao } from '../../backend/dao/dao';

export default async function Page() {
  const session = await auth();
  console.log(session);
  const user = await userDao.get(session.user.email, 'User');
  console.log('User', user);
  if (!user) {
    await userDao.create({
      pk: session.user.email,
      sk: 'User',
      name: session.user.name,
      image: session.user.image
    });
  }
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
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
