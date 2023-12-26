import { useCallback, useEffect, useState } from "react"

import { z, ZodType } from "zod"

import { getOne } from "../utils/api-client"

function createPagingSchema<ItemType extends z.ZodTypeAny>(itemSchema: ItemType) {
  return z.object({
    count: z.number(),
    next: z.string().url(),
    previous: z.string().url(),
    results: z.array(itemSchema),
  })
}

export function usePagingData<TData extends z.ZodTypeAny>(url: string, schema: ZodType) {
  const [results, setResults] = useState<TData[]>([])
  const [next, setNext] = useState("")
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const pagingSchema = createPagingSchema(schema)
  type pagingData = z.infer<typeof pagingSchema>

  const fetchPage = useCallback(async () => {
    // The data returned from a paging url is
    // count (number), next (url), previous (url),
    // and results (array)
    try {
      setLoading(true)
      const data = await getOne<pagingData>(url, pagingSchema)
      if (data) {
        setNext(data.next)
        setCount(data.count)
        setResults((prev) => [...prev, ...data.results])
      }
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }, [pagingSchema, url])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  return { next, count, results, loading }
}
