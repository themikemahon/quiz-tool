import { Pool, type QueryResultRow } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

export function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  // Build a parameterized query from the tagged template
  const text = strings.reduce((acc, str, i) => {
    return acc + str + (i < values.length ? `$${i + 1}` : '')
  }, '')

  return pool.query<T>(text, values)
}
