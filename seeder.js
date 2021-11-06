const fs=require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path : './config/config.env'})

//load models

const Bootcamp = require('./modals/Bootcamp');
const Course = require('./modals/Course');
const User = require('./modals/User');
const Review = require('./modals/Review')
//connect to DB

mongoose.connect(process.env.MONGO_URI);

//read json files
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8')
)
const bootcamps = JSON.parse
(fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse
(fs.readFileSync(`${__dirname}/data/courses.json`, 'utf-8'));
const users = JSON.parse
(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));

//import this to db

const importdata = async () =>{
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log('Data Imported to DB');
        process.exit();
    }
    catch(err){
console.error(err);
    }
}

//delete data
const destroydata = async () =>{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Deleted from DB');
        process.exit();
    }
    catch(err){
console.error(err);
    }
}
if(process.argv[2] == '-import'){
    importdata();
}
else if(process.argv[2] == '-destroy'){
    destroydata();
}