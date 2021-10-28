const express = require('express');
const errorHandler= require('../middleware/error'
)
const { getBootcamp, getBootcampsInRadius,getBootcamps, updateBootcamp,
    createBootcamp, deleteBootcamp, uploadBootcampPhoto } = require('../controllers/bootcamps');
//Include other resource routers
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../modals/Bootcamp');
const courseRouter = require('./courses')

    const router = express.Router();

    // Re-route into other resource routers

    router.use('/:bootcampId/courses',courseRouter);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/')
.get(advancedResults(Bootcamp, 'courses'),getBootcamps)
.post(createBootcamp)
router.route('/:id').get(getBootcamp)
.put(updateBootcamp).delete(deleteBootcamp);
router.route('/:id/photos').put(uploadBootcampPhoto);
//router.use(errorHandler);



module.exports = router;