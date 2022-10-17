//const mysql = require('mysql')

// const connectDB = (password) => {
//     const conn = mysql.createConnection({
//         host:"localhost",
//         user:"akachi",
//         password:password,
//         database:"SchoolMgtDB"
//     });
//    conn.connect()

// }

const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
  })
}

module.exports = connectDB