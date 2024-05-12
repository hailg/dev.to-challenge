import { signInFromLanding } from '@/actions/landing/landing';
import { Button } from '@/components/landing/Button';

export function SignUpForm() {
  return (
    <form action={signInFromLanding} className="relative isolate mt-8 flex items-center pr-1">
      <Button type="submit" arrow>
        Your dashboard
      </Button>
      <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-sky-300/15" />
      <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-sky-300" />
    </form>
  );
}
