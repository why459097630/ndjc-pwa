declare module '*.svg' {
  const src:
    | string
    | {
        src: string
        height?: number
        width?: number
      }

  export default src
}