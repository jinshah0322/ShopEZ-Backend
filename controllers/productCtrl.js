const Product = require("../models/productModel")
const customAPIError = require("../errors/custom-error")
const slugify = require("slugify")

const createProduct = async (req,res)=>{
    req.body.slug = slugify(req.body.title)
    const product = await Product.create(req.body)
    res.status(200).send({product,success:true}) 
}

const getAllProducts = async (req,res)=>{
    const products = await Product.find()
    res.status(200).send({count:products.length,products,success:true})
}

const getProduct = async (req,res)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        throw new customAPIError("product not found",404)
    }
    res.status(200).send({product,success:true})
}

const updateProduct = async (req,res)=>{
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!product){
        throw new customAPIError("product not found",404)
    }
    res.status(200).send({product,success:true})
}

const deleteProduct = async (req,res)=>{
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product){
        throw new customAPIError("product not found",404)
    }
    res.status(200).send({msg:"product deleted successfully",success:true})
}

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
}   