import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  splitLink,
} from '@trpc/client';

import type { AppRouter } from '../server/router.js';
import { transformer } from '../shared/transformer.js';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: 'http://localhost:3000',
        transformer,
      }),
      false: httpBatchStreamLink({
        url: 'http://localhost:3000',
        transformer,
      }),
    }),
  ],
});
