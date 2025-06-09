import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { RecordId } from 'surrealdb';

import config from '../config.js';
import type { Sample } from '../types.js';

import { useDBOnce } from '../../server/surreal.js';

async function readSamples() {
  try {
    const dirPath = resolve(config.downloadDirName);
    const fileNames = await readdir(dirPath);
    return (
      await Promise.all(
        fileNames
          .filter((fileName) => fileName.endsWith('.json'))
          .map(async (fileName) => {
            const filePath = resolve(dirPath, fileName);
            let chunks: Sample[] = [];
            try {
              const content = await readFile(filePath, 'utf-8');
              chunks = JSON.parse(content);
            } catch (error) {
              chunks = [];
            }
            return chunks;
          }),
      )
    ).flat();
  } catch (error) {
    console.error(error);
    return [] as Sample[];
  }
}

export async function runInsertCommand() {
  const startTime = Date.now();
  const samples = await readSamples();
  let successCount = 0;
  let errorCount = 0;
  for (const sample of samples) {
    try {
      await useDBOnce((db) =>
        db.upsert(new RecordId('products', sample.parent_asin), {
          title: sample.title,
          description: sample.description,
          thumbnail: sample.image,
          vector: sample.embeddings,
        }),
      );
      console.log(`Upserted ${sample.parent_asin} successfully.`);
      successCount++;
    } catch (error) {
      console.error(`Failed to upsert ${sample.parent_asin}`);
      errorCount++;
    }
  }
  const totalTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(
    `Completed! Upserted ${successCount}/${samples.length} samples in ${totalTimeSeconds}s.${errorCount <= 0 ? '' : `Failed to upsert ${errorCount} samples.`}\n`,
  );
}
