export function devWarn(msg: string) {
  if(process.env.NODE_ENV === "development") {
    console.warn(msg)
  }
}