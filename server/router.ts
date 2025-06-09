import { router } from './trpc.js';

import product from './procedures/product.js';

export const appRouter = router({
  product,
});

export type AppRouter = typeof appRouter;
