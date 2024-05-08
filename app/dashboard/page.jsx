import { auth } from 'app/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  console.log(session);
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
