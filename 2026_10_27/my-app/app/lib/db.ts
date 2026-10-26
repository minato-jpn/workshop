import { Pool, type QueryResultRow } from 'pg'

// 開発時はホットリロードのたびに Pool が増えないよう globalThis に保持する
const globalForDb = globalThis as unknown as { pool?: Pool }

export const pool =
  globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

// 検証用: DB_DELAY_MS=500 などで各クエリを遅くすると、ウォーターフォールかどうかがログで分かる
const delayMs = Number(process.env.DB_DELAY_MS ?? 0)

// 検証用: クエリの開始・終了をログに出す(start が並んでから end が並べば並行)
export const query = async <T extends QueryResultRow>(
  label: string,
  text: string,
  values?: unknown[]
) => {
  const startedAt = performance.now()
  console.log(`[db] start ${label}`)
  if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))
  const result = await pool.query<T>(text, values)
  console.log(`[db] end   ${label} (${Math.round(performance.now() - startedAt)}ms)`)
  return result
}
