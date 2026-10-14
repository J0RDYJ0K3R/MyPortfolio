const mongoose=require("mongoose");
const validId=id=>mongoose.isValidObjectId(id);
const err=(res,msg,status=400)=>res.status(status).json({message:msg});
const required=(body,fields)=>fields.filter(k=>typeof body[k]!=="string"||!body[k].trim());
const emailValid=x=>typeof x==="string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
const permitted=(body,allowed)=>Object.fromEntries(Object.entries(body||{}).filter(([k])=>allowed.includes(k)));
module.exports={validId,err,required,emailValid,permitted};
