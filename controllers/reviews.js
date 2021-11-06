const Bootcamp = require('../modals/Bootcamp');
const errResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../modals/Review');
const ErrorResponse = require('../utils/errorResponse');

// @desc  Get reviews
// @route  Get /api/v1/reviews
// @route  Get /api/v1/bootcamps/:bootcampId/reviews
// @access Public

exports.getReviews= asyncHandler( async(req,res,next)=>{

    if(req.params.bootcampId){
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if(!bootcamp){
            return next(new ErrorResponse('Bootcamp with id'+ req.params.id + 'not found'))
        }
        const reviews = await Review.find({
            bootcamp: req.params.bootcampId
        })
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    }
    else{
        res.status(200).json(res.advancedResults);
    }
    
    })

    // @desc  Get a single review
// @route  Get /api/v1/review/:id
// @access Public

exports.getAReview= asyncHandler( async(req,res,next)=>{

  const review =await Review.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description'
  });
  if(!review){
      return next(new ErrorResponse(`No review found with id of ${req.params.id}`,404));

  }
res.status(200).json({
    success: true,
    data: review
})
    
    })
    
    // @desc  Post a review
// @route  POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private

exports.addReview= asyncHandler( async(req,res,next)=>{

  req.body.bootcamp = req.params.bootcampId;
  req.body.user=req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp with this id doesnt exist',404))
    }     
 const review = await Review.create(req.body);
 return res.status(201).json({
     success: true,
     data: review
 })


})

   // @desc  update a review
// @route  PUT /api/v1/reviews/:id
// @access Private

exports.updateReview= asyncHandler( async(req,res,next)=>{

    let review = await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse('review not found',404))
    }
    if(review.user.toString()!=req.user.id && req.user.role!='admin'){
        return next(new ErrorResponse
            (`You do not have permission to delete this review`, 401));
    }
    review = await Review.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: review
    })
  
  
  })

   // @desc  DELETE a review
// @route  Delete /api/v1/reviews/:id
// @access Private

exports.deleteReview= asyncHandler( async(req,res,next)=>{

    let review = await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse('review not found',404))
    }
    if(review.user.toString()!=req.user.id && req.user.role!='admin'){
        return next(new ErrorResponse
            (`You do not have permission to delete this review`, 401));
    }
    review = await review.remove();
    res.status(200).json({
        success: true,
        deleteddata: review
    })
  
  
  })
        
        
      
      