const Course = require('../modals/Course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../modals/Bootcamp')
// @desc  Get All Courses
// @route  Get /api/v1/courses
// @route  Get /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses= asyncHandler( async(req,res,next)=>{

if(req.params.bootcampId){
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp with id'+ req.params.id + 'not found'))
    }
    const courses = await Course.find({
        bootcamp: req.params.bootcampId
    })
    return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
}
else{
    res.status(200).json(res.advancedResults);
}

})

// @desc  Get a single Courses
// @route  Get /api/v1/courses/:id
// @access Public

exports.getCourse= asyncHandler( async(req,res,next)=>{
   const course = await Course.findById(req.params.id)
   .populate({
       path: 'bootcamp',
       select: 'name description'
   })
   if(!course){
       return next(new ErrorResponse('Course with'+ req.params.id + 'not found'))
   }
   res.status(200).json({
       success:true,
       data: course
   })
    })

// @desc  Create a Courses
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.createCourse= asyncHandler( async(req,res,next)=>{
    req.body.bootcamp =  req.params.bootcampId;
    req.body.user=req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp with id'+ req.params.id + 'not found'))
    }

    //only owner of this bootcamp can add course  or admins
    if((bootcamp.user.toString() != req.user.id) && req.user.role!='admin'){
        return next(new ErrorResponse
            (`You do not have permission to add a course to the bootcamp - ${bootcamp._id}`, 401));
    }
    
    const course = await Course.create(req.body)
    res.status(200).send({
        success:true,
        data: course
    })
     })

     // @desc  Update Courses
// @route  PUT /api/v1/courses/:courseId
// @access Private
exports.updateCourse= asyncHandler( async(req,res,next)=>{
    let course = await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse('Course with id'+ req.params.id + 'not found'))
       }

       //Make sure user is course owner
       if((course.user.toString() != req.user.id) && req.user.role!='admin'){
        return next(new ErrorResponse
            (`You do not have permission to update this bootcamp`, 401));
    }
   course = await Course.findByIdAndUpdate(req.params.id,req.body,{
       new: true,
   })
   
   res.status(200).json({
       success: true,
       data: course
   })
     })

       // @desc  Delete Courses
// @route  DELETE /api/v1/courses/:courseId
// @access Private
exports.deleteCourse= asyncHandler( async(req,res,next)=>{
    let course = await Course.findById(req.params.id)
    console.log(course);
    if(!course){
        return next(new ErrorResponse('Course with id'+ req.params.id + 'not found'))
       }
    
         //Make sure user is course owner
         if((course.user.toString() != req.user.id) && req.user.role!='admin'){
            return next(new ErrorResponse
                (`You do not have permission to delete this bootcamp`, 401));
        }
   course = await course.remove()
   
   res.status(200).json({
       success: true,
       deleteddata: course
   })
     })