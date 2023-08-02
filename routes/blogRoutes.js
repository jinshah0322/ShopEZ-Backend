const express = require("express")
const router = express.Router()
const {createBlog,getAllBlog,updateBlog,getBlog,deleteBlog} = require("../controllers/blogCtrl")
const isAdmin = require("../middlewares/isAdmin")
const authMiddleware = require("../middlewares/authentication")

router.route("/").post(authMiddleware,isAdmin,createBlog).get(getAllBlog)
router.route("/:id").patch(authMiddleware,isAdmin,updateBlog).get(getBlog).delete(authMiddleware,isAdmin,deleteBlog)

module.exports = router