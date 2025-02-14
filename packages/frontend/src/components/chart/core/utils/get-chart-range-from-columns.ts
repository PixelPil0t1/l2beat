export function getChartRange<T extends readonly [number, ...unknown[]]>(
  data: T[] | undefined,
): [number, number] | undefined {
  if (!data) {
    return
  }
  const start = data.at(0)?.[0]
  const end = data.at(-1)?.[0]

  if (!start || !end) {
    return
  }

  return [start, end]
}

// TODO: Rename after migraiton
export function newGetChartRange<T extends { timestamp: number }>(
  data: T[] | undefined,
): [number, number] | undefined {
  if (!data) {
    return
  }

  const start = data.at(0)?.timestamp
  const end = data.at(-1)?.timestamp

  if (!start || !end) {
    return
  }

  return [start, end]
}
