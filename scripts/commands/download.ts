import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import config from '../config.js';
import type { Sample } from '../types.js';

// Dataset: https://huggingface.co/datasets/milistu/AMAZON-Products-2023
const DATASET_URL =
  'https://datasets-server.huggingface.co/rows?dataset=milistu%2FAMAZON-Products-2023&config=default&split=train';
const DATASET_COUNT = 117243;
const SAMPLE_LENGTH = 10;
const SAMPLE_TOTAL = 1000;

function createSamplingOffsets() {
  const max = Math.ceil(SAMPLE_TOTAL / SAMPLE_LENGTH);
  const step = Math.ceil(DATASET_COUNT / max);
  const offsets: number[] = [];
  for (let i = 0; i < DATASET_COUNT; i += step) {
    if (offsets.length >= max) break;
    offsets.push(i);
  }
  return offsets;
}

async function fetchSamples(offset: number, length: number) {
  const response = await fetch(
    `${DATASET_URL}&offset=${offset}&length=${length}`,
  );
  let data: { rows?: Array<{ row: Sample }>; error?: string } | undefined;
  try {
    data = await response.json();
  } catch (error) {}
  if (!response.ok)
    throw new Error(
      `[${response.status} - ${response.statusText}] ${data?.error ? data.error : 'No error message'}`,
    );
  return !data?.rows ? ([] as Sample[]) : data.rows.map(({ row }) => row);
}

async function execBatches(
  batches: Generator<number>,
  totalCount = 0,
  startTime = Date.now(),
) {
  const batch = batches.next();
  if (batch.done) {
    const totalTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    return console.log(
      `Completed! Downloaded ${totalCount}/${SAMPLE_TOTAL} samples in ${totalTimeSeconds}s.\n`,
    );
  }
  const offset = batch.value;
  let samples: Sample[] = [];
  try {
    const fileName = `${offset}-${offset + SAMPLE_LENGTH}.json`;
    const filePath = resolve(config.downloadDirName, fileName);
    if (existsSync(filePath)) {
      return console.log(
        `Skip downloading samples at #${offset} (already exists)`,
      );
    }
    samples = await fetchSamples(offset, SAMPLE_LENGTH);
    await writeFile(filePath, JSON.stringify(samples, null, 2));
    console.log(`Downloaded and saved ${samples.length} samples at #${offset}`);
  } catch (error) {
    console.log(
      `Error downloading samples at #${offset} (${
        error instanceof Error ? error.message : 'Unknown error'
      })`,
    );
  } finally {
    await execBatches(batches, totalCount + samples.length, startTime);
  }
}

export async function runDownloadCommand() {
  await mkdir(config.downloadDirName, { recursive: true });
  const offsets = createSamplingOffsets();
  const batches = (function* () {
    for (const offset of offsets) {
      yield offset;
    }
  })();
  await execBatches(batches);
}
