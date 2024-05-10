'use server';

import { signIn } from '@/app/auth';

export async function signInFromLanding() {
  await signIn('github', { redirectTo: '/dashboard' });
}
