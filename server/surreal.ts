import { surrealdbNodeEngines } from '@surrealdb/node';
import { Surreal } from 'surrealdb';

export async function getDB() {
  const db = new Surreal({
    engines: surrealdbNodeEngines(),
  });

  try {
    await db.connect('surrealkv://database/___surrealdb', {
      namespace: 'test',
      database: 'test',
    });
    return db;
  } catch (error) {
    console.error(
      'Failed to connect to SurrealDB:',
      error instanceof Error ? error.message : String(error),
    );
    await db.close();
    throw error;
  }
}

export async function useDBOnce<Result>(
  callback: (db: Surreal) => Promise<Result>,
) {
  const db = await getDB();
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    return await callback(db);
  } finally {
    await db.close();
  }
}
