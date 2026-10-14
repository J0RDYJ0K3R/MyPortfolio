const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
 firstName:{type:String,required:true,trim:true},
 lastName:{type:String,required:true,trim:true},
 name:{type:String,trim:true},
 email:{type:String,required:true,lowercase:true,trim:true},
 phone:{type:String,default:"",trim:true},
 subject:{type:String,default:"",trim:true},
 message:{type:String,required:true,trim:true}
},{timestamps:true});
module.exports=mongoose.model("Contact",contactSchema);
