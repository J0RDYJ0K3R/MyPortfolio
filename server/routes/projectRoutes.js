
const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const c = require("../controllers/project.controller");

// Read operations - accessible without login
router.get("/", c.list);
router.get("/:id", c.one);

// Create - administrators only
router.post("/", auth, admin, c.create);

// Update - administrators only
router.put("/:id", auth, admin, c.update);

// Delete - administrators only
router.delete("/:id", auth, admin, c.remove);

module.exports = router;
