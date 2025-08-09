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
 * Build edit inventory controller
 * *************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getItemDetailById(inv_id)
    const classificationsData = await invModel.getClassifications()
    let nav = await utilities.getNav()
    const { inv_make, inv_model } = data[0]
    res.render("./inventory/edit-inventory", {
      title: `Editing ${inv_make} ${inv_model}`,
      nav,
      classifications: classificationsData.rows,
      classification_id: data.classification_id,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_description: data[0].inv_description,
      inv_image: data[0].inv_image,
      inv_thumbnail: data[0].inv_thumbnail,
      inv_price: data[0].inv_price,
      inv_miles: data[0].inv_miles,
      inv_color: data[0].inv_color,
      classification_id: data[0].classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build delete inventory controller
 * *************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getItemDetailById(inv_id)
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: `Are you sure you want to delete ${itemName}?`,
    nav,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_price: data[0].inv_price,
    inv_image: data[0].inv_image,
  })
}

/* ***************************
 * Process delete inventory action controller
 * *************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if(deleteResult) {
    req.flash("notice", 'The deletion was successful.')
    res.redirect("/inv/management")
  } else {
    req.flash("notice", 'Sorry, the deletion failed')
    res.redirect("/inv/delete/inv_id")
  }
}

/* ***************************
 * Build update/edit inventory controller
 * *************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 * Build inv management controller
 * *************************** */
invCont.buildInvManagement = async function (req, res, next) {
  try {
    const management = await utilities.buildInvManagement()
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      management,
      errors: null,
      classificationSelect,
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

/* ***************************
 * Return Inventory by Classification As JSON
 * *************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build edit item view
 * *************************** */
invCont.editInvItemView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const invData = await invModel.getItemDetailById(inv_id)
  const classificationSelect = await invModel.buildClassificationList(invData.classification_id)
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/edit-vehicle", {
    title: `Edit ${itemName}`,
    nav,
    errors: null,
    invData,
    classificationSelect,
  })
}

module.exports = invCont