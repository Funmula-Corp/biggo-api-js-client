const replace = require("replace-in-file")

Object.keys(process.env).forEach(name => {
  if (name !== "API_AUTH_DOMAIN" && name !== "API_DOMAIN") {
    return
  }

  replace({
    files: ["lib/**/*.js"],
    from: new RegExp(`process\.env\.${name}`, "g"),
    to: `"${process.env[name]}"`,
  })
})