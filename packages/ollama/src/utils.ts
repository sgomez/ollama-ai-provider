export function removeUndefined(object: object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => v !== undefined),
  )
}
