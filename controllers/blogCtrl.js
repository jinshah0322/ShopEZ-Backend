require("express-async-errors")
const Blog = require("../models/blogSchema")
const User = require("../models/userModel")
const customAPIError = require("../errors/custom-error")

const createBlog = async (req,res)=>{
    const blog = await Blog.create(req.body)
    res.status(200).send({blog,success:true})
}

const getAllBlog = async (req,res)=>{
    const blogs = await Blog.find()
    res.status(200).send({count:blogs.length,blogs,success:true})
}

const updateBlog = async (req,res)=>{
    const blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(!blog){
        throw new customAPIError(`No blog found with id:${req.params.id}`,404)
    }
    res.status(200).send({blog,success:true})
}

const getBlog = async (req,res)=>{
    const blog = await Blog.findByIdAndUpdate(req.params.id,{$inc:{numViews:1}},{new:true})
    if(!blog){
        throw new customAPIError(`No blog found with id:${req.params.id}`,404)
    }
    res.status(200).send({blog,success:true})
}

const deleteBlog = async (req,res)=>{
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if(!blog){
        throw new customAPIError(`No blog found with id:${req.params.id}`,404)
    }
    res.status(200).send({msg:"Blog deleted successfully",success:true})
}

module.exports = {
    createBlog,
    getAllBlog,
    updateBlog,
    getBlog,
    deleteBlog
}