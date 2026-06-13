import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

export * from './schema';

export function getDb(connectionString: string) {
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export async function saveDecision(connectionString: string, decision: schema.NewDecision) {
  const db = getDb(connectionString);
  return await db.insert(schema.decisions).values(decision).returning();
}

export async function saveFavorite(connectionString: string, favorite: schema.NewFavorite) {
  const db = getDb(connectionString);
  return await db.insert(schema.favorites).values(favorite).returning();
}

export async function getFavorites(connectionString: string, userId?: string) {
  const db = getDb(connectionString);
  if (userId) {
    return await db.select().from(schema.favorites).where(eq(schema.favorites.userId, userId));
  }
  return await db.select().from(schema.favorites);
}
