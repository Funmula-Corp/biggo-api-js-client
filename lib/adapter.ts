import { implGetFileSize, implGetUploadFileBody } from "@funmula/api-core"
import fs from "node:fs"

implGetFileSize(path => {
  return fs.statSync(path).size
})

implGetUploadFileBody(path => {
  return { file: fs.createReadStream(path) }
})