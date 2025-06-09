import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { useDBOnce } from '../../server/surreal.js';
import config from '../config.js';

async function loadSchema(fileName: string) {
  const filePath = resolve(config.schemaDirName, fileName);
  return await readFile(filePath, 'utf-8');
}

export async function runSetupCommand() {
  const setupSchema = await loadSchema('setup.surql');
  await useDBOnce((db) => db.query(setupSchema));
  console.log('Database setup complete!');
}
