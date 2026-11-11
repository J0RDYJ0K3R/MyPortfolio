
const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/user.controller");

router.use(auth);

// Administrators only
router.get("/", admin, c.list);
router.post("/", admin, c.create);

// Users can manage only their own records
router.get("/:id", c.one);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
