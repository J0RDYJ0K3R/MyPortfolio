const Contact=require("../models/Contact");
const resource=require("./resource.controller");
const base=resource(Contact,["firstName","lastName","email","message"],["firstName","lastName","name","email","phone","subject","message"]);
const {err,emailValid}=require("../helpers/validation");
const create=base.create;
base.create=(req,res)=>{
 if(!req.body.firstName && typeof req.body.name==="string"){
  const names=req.body.name.trim().split(/\s+/);req.body.firstName=names.shift();req.body.lastName=names.join(" ")||"-";
 }
 if(!emailValid(req.body.email))return err(res,"Valid email required");
 return create(req,res);
};
module.exports=base;
