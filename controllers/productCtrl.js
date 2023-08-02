const Product = require("../models/productModel")
const customAPIError = require("../errors/custom-error")
const slugify = require("slugify")

const createProduct = async (req,res)=>{
    req.body.slug = slugify(req.body.title)
    const product = await Product.create(req.body)
    res.status(200).send({product,success:true}) 
}

const getAllProducts = async (req,res)=>{
    const {color,brand,category,fields,numericFilter,sort} = req.query
    const queryObject = {}
    if(color){
        queryObject.color = color
    }
    if(brand){
        queryObject.brand = brand
    }
    if(category){
        queryObject.category = category
    }
    if(numericFilter){
        const operatorMap = {
            '>':'$gt',
            '<':'$lt',
            '=':'$eq',
            '>=':'$gte',
            '<=':'$lte'
        } 
        const regex = /\b(<|>|=|<=|>=)\b/g
        let filter = numericFilter.replace(regex,(match)=>{
            return `-${operatorMap[match]}-`
        })
        const options = ["price","quantity","sold"]
        filter = filter.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-') 
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(",").join(' ')
        result = result.sort(sortList)
    } else{
        result = result.sort("createdAt")
    }
    if(fields){
        var fieldList = fields.split(",").join(' ')
        result = result.select(fieldList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    result = result.skip(skip).limit(limit)
    const products = await result
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