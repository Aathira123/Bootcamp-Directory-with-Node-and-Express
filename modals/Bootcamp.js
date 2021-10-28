const mongoose = require('mongoose');
const slugify= require('slugify');
const geocoder=require('../utils/geocoder');
const BootcampSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']  
    },
    slug: String,
    description: {
        type: String,
      required: [true, 'Please add a description'],
      trim: true,
      maxlength: [500, 'Cannot be more than 50 characters']  
    },
    website:{
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please add a valid url with http / https'
        ]
    },
    phone: {
        type: String,
        maxlength:[20, 'Phone number cannot exceed 20 characters']
    },
    email:{
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email '
        ]
    },
    address:{
        type: String,
        required: [true, 'Please enter an address']
    },
    location:{
        //GeoJSON Point
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
          },
          coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String

    },
    careers:{
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type: Number,
        min: [1, 'Rating must be more than 1'],
        max: [10, 'Rating must be less than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    acceptGi:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});
//Create bootcamp slug from the name
BootcampSchema.pre('save', function(next){
    this.slug=slugify(this.name, { lower: true })
    next();
})

//Geocode & create location field
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
this.location ={
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
          street: loc[0].streetName,
          city: loc[0].city,
          state: loc[0].stateCode,
          zipcode: loc[0].zipcode,
          country: loc[0].countryCode,
}

// no need to save address

this.address=undefined
    next();
})

//cascade delete courses when a bootcamp is deleted

BootcampSchema.pre('remove', async function (next){
    await this.model('Course').deleteMany({
        bootcamp: this._id
    });
    next();
})

//Reverse populate with virtuals

BootcampSchema.virtual('courses',{
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})
module.exports= mongoose.model('Bootcamp', BootcampSchema);