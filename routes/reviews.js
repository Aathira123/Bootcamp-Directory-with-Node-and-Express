const express = require('express');
const Review = require('../modals/Review')
const router = express.Router({
    mergeParams: true
});
const {protect, authorize} = require('../middleware/auth');
const advancedResults= require('../middleware/advancedResults');
const { getReviews, getAReview, addReview, updateReview,deleteReview } = require('../controllers/reviews')
router.route('/').get(advancedResults(Review,{
    path: 'bootcamp',
    select: 'name description'
}), getReviews).post(protect, authorize('user', 'admin'),addReview)
router.route('/:id').get(getAReview).put(protect, authorize('user', 'admin'),updateReview).delete(protect, authorize('user', 'admin'),deleteReview)
module.exports=router;