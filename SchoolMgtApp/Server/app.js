require('dotenv').config();
require('express-async-errors')


//express
const express = require('express')
const app = express();


//Rest of the Packages
const cookieParser = require('cookie-parser');

//database

const connectDB = require('./db/connect')

// routers
const authRoute = require('./routes/authRoute')
const peopleRoute = require('./routes/peopleRoute')


//Middlewares
const notFoundMiddleware = require('./middlwares/not-found');
const errorHandlerMiddleware = require('./middlwares/error-handler');



//main applications

//main application dependecy packages
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))


app.get('/', (req, res) =>{
    res.send("This is a welcome message")
})
//main application routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', peopleRoute)


//middleware application use

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




const port = process.env.PORT || 3000
const start = async () => {
    try {
            await connectDB(process.env.MONGO_URI)
            app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();