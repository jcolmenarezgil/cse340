const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont