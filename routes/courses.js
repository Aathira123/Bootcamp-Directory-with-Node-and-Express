const express = require('express');
const Course = require('../modals/Course')
const {protect, authorize} = require('../middleware/auth');
const advancedResults= require('../middleware/advancedResults');
const router = express.Router({
    mergeParams: true
});
const { getCourses, getCourse, deleteCourse,createCourse, updateCourse} = require('../controllers/courses')
router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(protect,authorize('publisher', 'admin'),createCourse)
router.route('/:id').get(getCourse).put(protect,authorize('publisher', 'admin'),updateCourse)
.delete(protect,authorize('publisher', 'admin'),deleteCourse)
module.exports = router