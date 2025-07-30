// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build item detail view
router.get("/detail/:itemdetailId", invController.buildItemDetailId);

// Route to build inv management view
router.get("/management", invController.buildInvManagement);

// Route to build add classification form view
router.get("/add-classification", invController.buildAddClassification);

// Route to build add vehicle
router.get("/add-inventory", invController.buildAddInventory);

// Router to register new classificaton
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.processAddClassification)
);

// Router to register new inventory
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

module.exports = router;