import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  if (user && (await isAuthenticated())) redirect('/events');

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <Suspense fallback={<p style={{ textAlign: 'center' }}>loading... on initial request</p>}>
        <div className="flex flex-col w-full h-full m-auto p-auto">
          <h1 className="text-slate-400 m-auto mb-8">WELCOME TO SJOEF</h1>
          <LoginLink className="group w-56 m-auto rounded-lg border border-transparent px-5 py-4 bg-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Login
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Log into an existing Sjoef account.
            </p>
          </LoginLink>

          <RegisterLink className="group m-auto mt-8 w-56 rounded-lg border bg-gray-200 border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Register
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Create a new Sjoef account.</p>
          </RegisterLink>
        </div>
      </Suspense>
    </div>
  );
}
