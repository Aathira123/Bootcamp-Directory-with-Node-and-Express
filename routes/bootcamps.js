const express = require('express');
//const errorHandler= require('../middleware/error')
//PROTECT VERIFIES JWT , AUTHORIZE CHECKS FOR ROLES
const {protect, authorize} = require('../middleware/auth');
const { getBootcamp, getBootcampsInRadius,getBootcamps, updateBootcamp,
    createBootcamp, deleteBootcamp, uploadBootcampPhoto } = require('../controllers/bootcamps');
//Include other resource routers
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../modals/Bootcamp');
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

    const router = express.Router();

    // Re-route into other resource routers

    router.use('/:bootcampId/courses',courseRouter);
    router.use('/:bootcampId/reviews',reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
.get(advancedResults(Bootcamp, 'courses'),getBootcamps)
.post(protect, authorize('publisher', 'admin'),createBootcamp)

router.route('/:id').get(getBootcamp)
.put(protect,authorize('publisher', 'admin'),updateBootcamp).delete(protect, authorize('publisher', 'admin'),deleteBootcamp);

router.route('/:id/photos').put(protect, authorize('publisher', 'admin'),uploadBootcampPhoto);
//router.use(errorHandler);



module.exports = router;