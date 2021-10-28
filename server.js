const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
//global error handling middlewaee
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
//Load env vars
dotenv.config({ path: './config/config.env' })
//connect to database
connectDB();
//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const path = require('path')
const app = express();
// Body parser
app.use(express.json());
//Logging middleware
if(process.env.NODE_ENV=='development'){
app.use(morgan('dev'))

}
// file uploading

app.use(fileUpload());

//set static folder as public
app.use(express.static(path.join(__dirname, 'public')))
// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);
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