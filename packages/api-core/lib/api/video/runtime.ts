export let getUploadFileBody: (filepath: string) => any = () => {
  throw new Error("need impl upload file body abstract")
}

export function implGetUploadFileBody(f: (fp: string) => any) {
  getUploadFileBody = f
}

export let getFileSize: (filepath: string) => number = () => {
  throw new Error("need impl get file size abstract")
}

export function implGetFileSize(f: (fp: string) => number) {
  getFileSize = f
}