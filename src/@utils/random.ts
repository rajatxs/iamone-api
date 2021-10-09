/** Generate alpha-numeric value */
export function alphaNumeric(length: number = 8): string {
   const v = Array(length)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('')

   return v
}
