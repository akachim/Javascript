const { METHOD_FAILURE } = require("http-status-codes")

const notFound = (req, res) => res.status(404).send('Route does not exist')

module.exports=notFound