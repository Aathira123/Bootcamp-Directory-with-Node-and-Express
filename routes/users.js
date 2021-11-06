const express= require('express')
const router = express.Router();
const User = require('../modals/User');
const {protect, authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults')
const {getUser,getUsers,createUser,deleteUser,updateUser} = require('../controllers/users')
router.use(protect);
router.use(authorize('admin'));
router.route('/')
.get(advancedResults(User),getUsers)
.post(createUser);

router.route('/:userId')
.get(getUser)
.put(updateUser)
.delete(deleteUser);

module.exports=router;