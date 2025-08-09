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

// Get inventory for AJAX Route
router.get(
    "/getInventory/:classification_id",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build inv management view
router.get("/management", utilities.checkAuthorization, utilities.handleErrors(invController.buildInvManagement));

// Route to build add classification form view
router.get("/add-classification", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification));

// Route to build add vehicle
router.get("/add-inventory", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddInventory));

// Route to edit vehicle (Check if loggin and handleErrors)
router.get(
    "/edit/:inv_id", 
    utilities.checkAuthorization, 
    utilities.handleErrors(invController.buildEditInventory));

// Router to update vehicle
router.post(
    "/update",
    utilities.checkAuthorization,
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));
    
// Router to register new classificaton
router.post(
    "/add-classification",
    utilities.checkAuthorization,
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.processAddClassification)
);

// Router to register new inventory
router.post(
    "/add-inventory",
    utilities.checkAuthorization,
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

// Router to delete element from inventory
router.get(
    "/delete/:inv_id",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildDeleteView)
)

// Router to process delete element from the inventory
router.post(
    "/delete",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.deleteItem)
)

module.exports = router;