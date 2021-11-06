const mongoose = require('mongoose')


const ReviewSchema=new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, 'Please add a title for the Review'],
        maxlength: 100
    },
    text:{
        type: String,
        required: [true, 'Please add some text']
    },
    rating:{
        type: Number,
        min:1,
        max:10,
        required: [true, 'Please add a rating between 1 and 10']
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
});
//static method to calculate average rating
ReviewSchema.statics.getAverageRating = async function(bootcampId){
    const obj = await this.aggregate(
        [
            {
                $match: {bootcamp: bootcampId}
            },
            {
                $group:{
                    _id: '$bootcamp',
                    averageRating:{ $avg: '$rating'}
                }
            }
        ]
    )
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRating: obj[0].averageRating
        }, {new : true})
        
    } catch (error) {
        console.error(error);
    }
}
ReviewSchema.post('save', async function(){
    await this.constructor.getAverageRating(this.bootcamp);
})
// Call getAverageCost before remove

ReviewSchema.post('remove', async function(){
    await this.constructor.getAverageRating(this.bootcamp);
    
})
//One review per bootcamp
ReviewSchema.index({ bootcamp : 1, user: 1}, {unique: true})
module.exports=mongoose.model('Review',ReviewSchema)
