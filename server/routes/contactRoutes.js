
const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const c = require("../controllers/contact.controller");

// Public contact form submission
router.post("/", c.create);

// Authenticated users can view contacts
router.get("/", auth, c.list);
router.get("/:id", auth, c.one);

// Administrators only: update and delete contacts
router.put("/:id", auth, admin, c.update);
router.delete("/:id", auth, admin, c.remove);

module.exports = router;
