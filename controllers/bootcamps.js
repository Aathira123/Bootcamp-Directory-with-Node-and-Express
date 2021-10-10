
// @desc  Get All Bootcamps
// @route  Get /api/v1/bootcamps
// @access Public
exports.getBootcamps=(req,res,next) =>{
    res.status(200).json({ success: true, msg: 'Show all bootcamps' })
}

// @desc  Get A particular Bootcamps
// @route  Get /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp=(req,res,next) =>{
    res.status(200).json({ success: true, msg: `Get ${req.params.id}` })
}

// @desc  Create Bootcamp
// @route  Post /api/v1/bootcamps
// @access Private
exports.createBootcamp=(req,res,next) =>{
    res.status(200).json({ success: true, msg: `Create` })
}

// @desc  Update A particular Bootcamp
// @route  Put /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp=(req,res,next) =>{
    res.status(200).json({ success: true, msg: `Update ${req.params.id}` })
}

// @desc  Delete A particular Bootcamps
// @route  delete /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp=(req,res,next) =>{
    res.status(200).json({ success: true, msg: `delete ${req.params.id}` })
}