export const logger=(req,res,next)=>{console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);next();};
export const notFound=(req,res)=>res.status(404).json({message:'Route not found'});
export const errorHandler=(err,req,res,next)=>{console.error(err);if(err.name==='ValidationError'||err.name==='CastError'||err.code===11000)return res.status(400).json({message:err.code===11000?'Duplicate value':err.message});res.status(500).json({message:'Internal server error'});};
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
