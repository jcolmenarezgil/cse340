const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
  *  Registration Classification Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a classification name")
    ]
}

/*  **********************************
  *  Registration Inventory Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        //classification_id
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please select a classification"),

        // inv_make
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a make"),

        // inv_model
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a model"),

        // inv_year
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage("Please provide a year"),

        // inv_description
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please provide a description"),

        // inv_image
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide an image URL"),

        //inv_thumbnail
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a thumbnail URL"),

        // inv_price
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a price"),

        // inv_miles
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide miles"),

        // inv_color
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color")
    ]
}

/* ******************************
* Check Classification Data and return errors
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()  
}

/* ******************************
* Check Inventory Data and return errors
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        })
        return
    }
    next()
}


module.exports = validate