const express = require("express")
const router = express.Router()
const {createProduct,getAllProducts,getProduct,updateProduct,deleteProduct} = require("../controllers/productCtrl")
const authMiddleware = require("../middlewares/authentication")
const isAdmin = require("../middlewares/isAdmin")

router.route("/").post(authMiddleware,isAdmin,createProduct).get(getAllProducts)
router.route("/:id").get(getProduct).patch(authMiddleware,isAdmin,updateProduct).delete(authMiddleware,isAdmin,deleteProduct)

module.exports = router