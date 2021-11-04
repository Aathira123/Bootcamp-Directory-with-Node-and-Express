const mongoose = require('mongoose')
const Bootcamp = require ('./Bootcamp')

const CourseSchema=new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description:{
        type: String,
        required: [true, 'Please add description ']
    },
    weeks:{
        type: String,
        required: [true, 'Please add number of weeks ']
    },
    tuition:{
        type: Number,
        required: [true, 'Please add a Tuition cost ']
    },
    minimumSkill:{
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp:{
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})
//static method to get avg
CourseSchema.statics.getAvgCost = async function(bootcampId){
const obj = await this.aggregate([
    {
        $match: {bootcamp: bootcampId}
    },
    {
        $group:{
            _id: '$bootcamp',
            averageCost: { $avg : '$tuition'}
        }
    }
]);
try {
    await Bootcamp.findByIdAndUpdate(bootcampId,{
        averageCost: Math.ceil(obj[0].averageCost/10)*10
    }, {new : true})
    
} catch (error) {
    console.error(error);
}
}
// Call getAverageCost after save

CourseSchema.post('save', async function(){
    //console.log('called with id' + this.bootcamp);
  await this.constructor.getAvgCost(this.bootcamp);
})

// Call getAverageCost before remove

CourseSchema.post('remove', async function(){
    await this.constructor.getAvgCost(this.bootcamp);
    
})
module.exports = mongoose.model('Course', CourseSchema)