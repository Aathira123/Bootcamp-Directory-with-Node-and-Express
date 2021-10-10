const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db');
//Load env vars
dotenv.config({ path: './config/config.env' })
//connect to database
connectDB();
//Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

//Logging middleware
if(process.env.NODE_ENV=='development'){
app.use(morgan('dev'))

}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
const PORT = process.env.PORT || 5000
const server =app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in the mode ${process.env.NODE_ENV}`);
});

//Handle Unhandled Promise rejections
process.on('unhandledRejection',(err, promise) =>{

    console.log(`Error: ${err.message}`);
    //close the server and exit process
    server.close(() => process.exit(1));
})