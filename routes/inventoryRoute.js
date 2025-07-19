// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build item detail view
router.get("/detail/:itemdetailId", invController.buildItemDetailId);

module.exports = router;