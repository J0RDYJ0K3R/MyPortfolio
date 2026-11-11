const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const auth=require("../middleware/authMiddleware");
const {err,emailValid}=require("../helpers/validation");
router.post("/register",async(req,res)=>{
 const {name,username,email,password}=req.body||{};
 if(!name?.trim() && !username?.trim())return err(res,"Name is required");
 if(!emailValid(email)||typeof password!=="string"||password.length<8)return err(res,"Valid email and password (8+ characters) required");
 try {
  const exists=await User.findOne({$or:[{email:email.toLowerCase()},...(username?[{username}]:[])]});
  if(exists)return err(res,"User already exists",409);
  const user=await User.create({name:(name||username).trim(),username:username?.trim(),email:email.toLowerCase(),password:await bcrypt.hash(password,12)});
  res.status(201).json({message:"User registered successfully",userId:user.id});
 }catch(e){if(e.code===11000)return err(res,"User already exists",409);res.status(500).json({message:"Registration failed"});}
});
router.post("/login",async(req,res)=>{
 const {email,password}=req.body||{};
 if(!emailValid(email)||!password)return err(res,"Email and password required");
 try{
  const user=await User.findOne({email:email.toLowerCase()}).select("+password");
  if(!user||!(await bcrypt.compare(password,user.password)))return err(res,"Invalid email or password",401);
  const token=jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:"1h"});
  res.json({message:"Login successful",token,username:user.username||user.name});
 }catch(e){res.status(500).json({message:"Login failed"});}
});
router.post("/logout",auth,(req,res)=>res.json({message:"Signed out. Delete the access token on the client. This endpoint does not revoke issued tokens; they expire within one hour."}));
router.get("/me", auth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role
  });
});
module.exports=router;


