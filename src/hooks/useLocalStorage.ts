import { useCallback, useEffect, useRef, useState } from "react"
import { readJson, writeJson } from "@/lib/storage"

/**
 * Generic localStorage-backed state hook. Reads/writes are wrapped in
 * try/catch (via readJson/writeJson) so a full or corrupted storage never
 * crashes the app — it just falls back to in-memory state.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readJson(key, initialValue))
  const keyRef = useRef(key)
  keyRef.current = key

  useEffect(() => {
    writeJson(keyRef.current, value)
  }, [value])

  const setAndPersist = useCallback((next: T | ((prev: T) => T)) => {
    setValue(next)
  }, [])

  return [value, setAndPersist]
}
