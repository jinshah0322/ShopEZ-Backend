const express = require("express")
const router = express.Router()
const {createUser,loginUser,getAllUser,getUser,UpdateUser,deleteUser,blockUser,unblockUser} = require("../controllers/userCtrl")
const authMiddleware = require("../middlewares/authentication")
const isAdmin = require("../middlewares/isAdmin")

router.route("/login").post(loginUser)
router.route("/").get(authMiddleware, getAllUser).post(createUser)
router.route("/:id").get(authMiddleware, getUser)
                    .patch(authMiddleware, UpdateUser)
                    .delete(authMiddleware, deleteUser)
router.route("/blockuser/:id").patch(authMiddleware, isAdmin, blockUser)
router.route("/unblockuser/:id").patch(authMiddleware, isAdmin, unblockUser)

module.exports = router