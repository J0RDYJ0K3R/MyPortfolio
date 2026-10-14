const router=require("express").Router();
const auth=require("../middleware/authMiddleware");
const c=require("../controllers/contact.controller");
router.get("/",auth,c.list);
router.get("/:id",auth,c.one);
router.post("/",c.create);
router.put("/:id",auth,c.update);
router.delete("/:id",auth,c.remove);
module.exports=router;
