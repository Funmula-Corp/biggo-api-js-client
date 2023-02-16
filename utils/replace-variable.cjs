const replace = require("replace-in-file")

Object.keys(process.env).forEach(name => {
  replace({
    files: ["lib/**/*.js"],
    from: new RegExp(`process\.env\.${name}`, "g"),
    to: `"${process.env[name]}"`,
  })
})