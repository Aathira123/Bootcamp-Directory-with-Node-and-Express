const Bootcamp = require('../modals/Bootcamp');
const errResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const path = require('path');
const asyncHandler = require('../middleware/async');
// @desc  Get All Bootcamps
// @route  Get /api/v1/bootcamps
// @access Public
exports.getBootcamps= async(req,res,next) =>{
console.log('2nd');
       res.status(200).json(res.advancedResults);
   

}

// @desc  Get A particular Bootcamps
// @route  Get /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp=(req,res,next) =>{
    Bootcamp.findById(req.params.id)
    .then(resp=>{
        if(resp==null){
            return next(new errResponse
                (`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: resp
        })
    })
    .catch(err=>{
        next(err)
})
}
// @desc  Create Bootcamp
// @route  Post /api/v1/bootcamps
// @access Private
exports.createBootcamp=asyncHandler( async (req,res,next) =>{    
    const bootcamp= await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
   
   
  
})

// @desc  Update A particular Bootcamp
// @route  Put /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp= asyncHandler(async(req,res,next) =>{
        const bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        })
        if(bootcamp == null){
            return next(new errResponse
                (`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp})
   
    
})

// @desc  Delete A particular Bootcamps
// @route  delete /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp= asyncHandler(async(req,res,next) =>{

    const deletedbootcamp= await Bootcamp.findById(req.params.id);
    if(deletedbootcamp ==null){
        return next(new errResponse
            (`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    deletedbootcamp.remove();
    res.status(200).json({
        success: true,
        deletedData: deletedbootcamp
    })
  
    

})

// @desc  Get Bootcamps within radius
// @route  get /api/v1/bootcamps/radius/:zipcode/:distance
// @access Public
exports.getBootcampsInRadius= asyncHandler(async(req,res,next) =>{

  const {zipcode, distance} =req.params;

  //get latitude and longitude from geocode
  const loc = await geocoder.geocode(zipcode);
  const lat=loc[0].latitude;
  const long=loc[0].longitude;
    
  //calculate radius using radians
  //Divide distance by radius of Earth
  // Earth Radius = 3,663 miles / 6,378km
  const rad = distance / 3963;
  const bootcamps = await Bootcamp.find({
      location: {$geoWithin: {$centerSphere: [ [long,lat], rad]}}
  })
  res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
  })


})

// @desc  Upload photo for Bootcamps
// @route  PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.uploadBootcampPhoto= asyncHandler(async(req,res,next) =>{

    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new errResponse('Bootcamp not found with id ' + req.params.id, 404));

    }

    if(!req.files){
        return next(new errResponse('Please upload a file', 400));
    }
    const file = req.files.file;
    // Make sure image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new errResponse
            ('Please upload an Image file', 400));
    }

    //Check file size
    if(file.size > process.env.MAX_FILE_SIZE){
        return next(new errResponse
            ('Please upload an Image less than ' + process.env.MAX_FILE_SIZE, 400));
    }
 // create custom name for file

 file.name = `photo_${bootcamp._id}${path.extname(file.name)}`
 file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async(err) =>{
     if(err){
         console.error(err);
         return next(new errResponse
            ('Problem while uploading ' , 500));
     }
     await Bootcamp.findByIdAndUpdate(req.params.id, {
         photo: file.name
     })
     res.status(200)
     .json({
         success: true,
         data: file.name
     })
 })

})
