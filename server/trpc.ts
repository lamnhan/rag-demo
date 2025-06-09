import { initTRPC } from '@trpc/server';
import { transformer } from '../shared/transformer.js';

const trpc = initTRPC.create({
  transformer,
});

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
