const replace = require("replace-in-file")

async function main() {
  await replace({
    files: ["lib/**/*.js"],
    from: `process.env.API_DOMAIN`,
    to: `"${process.env.API_DOMAIN}"`,
  })

  await replace({
    files: ["lib/**/*.js"],
    from: `process.env.API_AUTH_DOMAIN`,
    to: `"${process.env.API_AUTH_DOMAIN}"`,
  })
}

main()