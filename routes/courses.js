const express = require('express');
const Course = require('../modals/Course')
const advancedResults= require('../middleware/advancedResults');
const router = express.Router({
    mergeParams: true
});
const { getCourses, getCourse, deleteCourse,createCourse, updateCourse} = require('../controllers/courses')
router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(createCourse)
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)
module.exports = router