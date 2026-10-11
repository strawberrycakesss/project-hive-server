import mongoose from 'mongoose';
export const validateId=(req,res,next)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid ID'});next();};
export const crud=(Model)=>({
 list:async(req,res)=>res.json(await Model.find().sort({createdAt:-1})),
 get:async(req,res)=>{const x=await Model.findById(req.params.id);if(!x)return res.status(404).json({message:'Record not found'});res.json(x)},
 create:async(req,res)=>res.status(201).json(await Model.create(req.body)),
 update:async(req,res)=>{const x=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!x)return res.status(404).json({message:'Record not found'});res.json(x)},
 remove:async(req,res)=>{const x=await Model.findByIdAndDelete(req.params.id);if(!x)return res.status(404).json({message:'Record not found'});res.json({message:'Record deleted'})}
});
