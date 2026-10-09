import { createAuthClient } from 'better-auth/svelte';
import { sentinelClient } from '@better-auth/infra/client';
import { passkeyClient } from '@better-auth/passkey/client';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  plugins: [
    sentinelClient({
      identifyUrl: 'https://kv.better-auth.com/projects/yh5Gtwa3RJxVFDX2SCVc2opaVjI5B0mF'
    }),
    passkeyClient()
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
