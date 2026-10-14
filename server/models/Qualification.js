const mongoose = require("mongoose");
const qualificationSchema=new mongoose.Schema({
 title:{type:String,required:true,trim:true},
 completionDate:{type:Date,required:true},
 description:{type:String,required:true,trim:true}
},{timestamps:true});
module.exports=mongoose.model("Qualification",qualificationSchema);
