const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const invCont = {}

/* ***************************
 *  Build inventory controller by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build item detail controller by item detail id
 * *************************** */
invCont.buildItemDetailId = async function (req, res, next) {
  try {
    const itemdetail_id = req.params.itemdetailId
    const data = await invModel.getItemDetailById(itemdetail_id)
    const grid_detail = await utilities.buildItemDetailView(data)
    let nav = await utilities.getNav()
    const { inv_year, inv_make, inv_model } = data[0]
    res.render("./inventory/itemdetail", {
      title: inv_year + " " + inv_make + " " + inv_model,
      nav,
      grid_detail,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inv management controller
 * *************************** */
invCont.buildInvManagement = async function (req, res, next) {
  try {
    const management = await utilities.buildInvManagement()
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      management,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build add classification form controller
 * *************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const addClassification = await utilities.buildAddClassification()
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      addClassification,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build add vehicle form controller
 * *************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const addinventory = await utilities.buildAddInventory()
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      addinventory,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}
/* ***************************
 * Process Add Classification
 * *************************** */
invCont.processAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const addResult = await invModel.addClassification(classification_name)
    const addClassification = await utilities.buildAddClassification()

    if (addResult) {
      req.flash("notice", `Great Job! you\'re registered ${classification_name} classification to the inventory..`)
      res.status(201).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        addClassification,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    next(error)
  }
}
/* ***************************
 * Process Add Inventory
 * *************************** */
invCont.processAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    const addResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
    const addinventory = await utilities.buildAddInventory()

    if (addResult) {
      req.flash("notice", `Great Job! you're registered ${inv_make} ${inv_model} to the inventory..`)
      res.status(201).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        addinventory,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        addinventory,
        errors: null,
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont