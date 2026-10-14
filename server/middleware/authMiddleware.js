const jwt = require("jsonwebtoken");
module.exports=(req,res,next)=>{
 const match=/^Bearer (\S+)$/.exec(req.headers.authorization||"");
 if(!match)return res.status(401).json({message:"Authentication token required"});
 try {req.user=jwt.verify(match[1],process.env.JWT_SECRET);next();}
 catch(_error){return res.status(401).json({message:"Invalid or expired token"});}
};
