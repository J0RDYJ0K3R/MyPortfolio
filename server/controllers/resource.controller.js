const { validId,err,required,permitted }=require("../helpers/validation");
function resourceController(Model,requiredFields,allowedFields){
 const validate=(body)=>{
  const missing=required(body,requiredFields);
  if(missing.length)return `Required fields: ${missing.join(", ")}`;
  if(requiredFields.includes("completionDate") && Number.isNaN(Date.parse(body.completionDate)))return "Valid completionDate is required";
  return null;
 };
 const failure=(res,e)=>err(res,e.name==="ValidationError"?e.message:"Invalid request data",400);
 return {
  list:async(req,res)=>{try{res.json(await Model.find().sort({createdAt:-1}));}catch(e){res.status(500).json({message:"Unable to retrieve records"});}},
  one:async(req,res)=>{if(!validId(req.params.id))return err(res,"Invalid ID");try{const item=await Model.findById(req.params.id);if(!item)return err(res,"Record not found",404);res.json(item);}catch(e){res.status(500).json({message:"Unable to retrieve record"});}},
  create:async(req,res)=>{const body=permitted(req.body,allowedFields);const v=validate(body);if(v)return err(res,v);try{res.status(201).json(await Model.create(body));}catch(e){failure(res,e);}},
  update:async(req,res)=>{if(!validId(req.params.id))return err(res,"Invalid ID");const body=permitted(req.body,allowedFields);if(!Object.keys(body).length)return err(res,"No valid fields supplied");if("completionDate" in body && Number.isNaN(Date.parse(body.completionDate)))return err(res,"Invalid completionDate");try{const item=await Model.findByIdAndUpdate(req.params.id,{$set:body},{returnDocument:"after",runValidators:true});if(!item)return err(res,"Record not found",404);res.json(item);}catch(e){failure(res,e);}},
  remove:async(req,res)=>{if(!validId(req.params.id))return err(res,"Invalid ID");try{const item=await Model.findByIdAndDelete(req.params.id);if(!item)return err(res,"Record not found",404);res.json({message:"Record deleted successfully"});}catch(e){res.status(500).json({message:"Unable to delete record"});}}
 };
}
module.exports=resourceController;
