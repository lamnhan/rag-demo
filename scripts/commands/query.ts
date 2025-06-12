import { inspect } from 'node:util';

import { useDBOnce } from '../../server/surreal.js';

export async function runQueryCommand(query: string) {
  if (!query) {
    return console.log('Please provide a valid SurQL query.\n');
  }
  const result = await useDBOnce((db) => db.query(query));
  console.log(inspect(result, { depth: null, colors: true }));
}
