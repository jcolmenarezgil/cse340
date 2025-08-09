const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ***************************
*  Build inventory by classification view
* ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  console.log(data.rows)
  let list = "<ul>"
  list += '<li><a href="/" title="Home Page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ***************************
*  Build classification list from database
* ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value='' selected>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li class="inv-list-item">'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + 'details"><img src="' + vehicle.inv_thumbnail + '" title="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" alt="' + vehicle.inv_make + '_' + vehicle.inv_model + '" loading="lazy" />'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      grid += '<span><strong>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</strong></span>'
      grid += '</div></a>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the item detail view
 * ************************************** */
Util.buildItemDetailView = async function (data) {
  let grid_detail
  if (data.length > 0) {
    grid_detail = '<div id="item-detail">'
    data.forEach(detail => {
      grid_detail += '<div class="detail-image">'
      grid_detail += '<img src="' + detail.inv_image + '" title="Details of ' + detail.inv_model + ' ' + detail.inv_make + ' on CSE Motors" alt="' + detail.inv_make + '_' + detail.inv_model + '" loading="lazy">'
      grid_detail += '</div>'
      grid_detail += '<div class="detail-info">'
      grid_detail += '<a class="goback-button" href="../../inv/type/' + detail.classification_id + '" title="Go back to our inventory of ' + detail.classification_name + ' vehicles">Go back to ' + detail.classification_name + '\'s</a>'
      grid_detail += '<hr />'
      grid_detail += '<h2>' + detail.inv_model + ' Details </h2>'
      grid_detail += '<ul>'
      grid_detail += '<li><p><strong>Price: $' + new Intl.NumberFormat('en-US').format(detail.inv_price) + '</strong></p></li>'
      grid_detail += '<li><p><strong>Description</strong>:' + detail.inv_description + '</p></li>'
      grid_detail += '<li><p><strong>Color: </strong>' + detail.inv_color + '</p></li>'
      grid_detail += '<li><p><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(detail.inv_miles) + '</p></li>'
      grid_detail += '</ul>'
      grid_detail += '</div>'
    })
    grid_detail += '</div>'
  } else {
    grid_detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid_detail
}

/* **************************************
 * Build the vehicle management view
 * ************************************** */
Util.buildInvManagement = async function (res, req, next) {
  let management = '<div id="inv-management">'
  management += '<ul>'
  management += '<li><a href="/inv/add-classification">Add New Classification</a></li>'
  management += '<li><a href="/inv/add-inventory">Add New Vehicle</a></li>'
  management += '</ul>'
  return management
}

/* **************************************
 * Build the add classification form view
 * ************************************** */
Util.buildAddClassification = async function (res, req, next) {
  let addclassification = '<div id="add-classification" class="add-classification">'
  addclassification += '<form action="/inv/add-classification" class="classification-form" method="post">'
  addclassification += '<span class="notice"> The new classification name cannot contain a space or special character </span>'
  addclassification += '<label for="classification_name">Classification Name'
  addclassification += '<input type="text" name="classification_name" id="classification_name" placeholder="Type a classification name without spaces or special characters" pattern="^[a-zA-Z]+$" required>'
  addclassification += '</label>'
  addclassification += '<button type="submit">Add Classification</button>'
  addclassification += '</form>'
  return addclassification
}

/* **************************************
 * Build add inventory form with classificationList view
 * ************************************** */
Util.buildAddInventory = async function ({
  classification_id = "",
  inv_make = "",
  inv_model = "",
  inv_description = "",
  inv_image = "/images/vehicles/no-image.png",
  inv_thumbnail = "/images/vehicles/no-image.png",
  inv_price = "",
  inv_year = "",
  inv_miles = "",
  inv_color = ""
} = {}) {
  let classificationList = await Util.buildClassificationList(classification_id)
  let addInventory = '<div class="add-inventory" id="add-inventory">'
  addInventory += '<form action="/inv/add-inventory" class="inventory-form" method="post">'
  addInventory += '<label for="classificationList">Classification'
  addInventory += classificationList
  addInventory += '</label>'
  addInventory += '<label for="inv_make">Make'
  addInventory += `<input type="text" name="inv_make" id="inv_make" value="${inv_make}" placeholder="Min of 3 characters" pattern="^[a-zA-Z]+$" required>`
  addInventory += '</label>'
  addInventory += '<label for="inv_model">Model'
  addInventory += `<input type="text" name="inv_model" id="inv_model" value="${inv_model}" placeholder="Min of 3 characters" pattern="^[a-zA-Z0-9 .-]+$" required>`
  addInventory += '</label>'
  addInventory += '<label for="inv_description">Description'
  addInventory += `<textarea name="inv_description" id="inv_description" rows="3" cols="30" required>${inv_description}</textarea>`
  addInventory += '</label>'
  addInventory += '<label for="inv_image">Image Path'
  addInventory += `<input type="text" name="inv_image" id="inv_image" value="${inv_image}" required>`
  addInventory += '</label>'
  addInventory += '<label for="inv_thumbnail">Thumbnail Path'
  addInventory += `<input type="text" name="inv_thumbnail" id="inv_thumbnail" value="${inv_thumbnail}" required>`
  addInventory += '</label>'
  addInventory += '<div class="inline-group">'
  addInventory += '<label for="inv_price">Price'
  addInventory += `<input type="number" name="inv_price" id="inv_price" value="${inv_price}" placeholder="decimals or whole numbers only" pattern="[0-9]*(\.[0-9]{1,2})?" required>`
  addInventory += '</label>'
  addInventory += '<label for="inv_year">Year'
  addInventory += `<input type="number" name="inv_year" id="inv_year" value="${inv_year}" placeholder="YYYY (numbers only)" pattern="[0-9]{4}" required>`
  addInventory += '</label>'
  addInventory += '</div>'
  addInventory += '<div class="inline-group">'
  addInventory += '<label for="inv_miles">Miles'
  addInventory += `<input type="number" name="inv_miles" id="inv_miles" value="${inv_miles}" placeholder="digits only" required>`
  addInventory += '</label>'
  addInventory += '<label for="inv_color">Color'
  addInventory += `<input type="text" name="inv_color" id="inv_color" value="${inv_color}" required>`
  addInventory += '</label>'
  addInventory += '</div>'
  addInventory += '<button type="submit">Add New Vehicle</button>'
  addInventory += '</form>'
  return addInventory;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
 * Middleware to check token validity
 * ************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* **************************************
 * Check Login
 * ************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* **************************************
 * Middleware to check for Employee or Admin authorization
 * ************************************** */
Util.checkAuthorization = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type
    if (accountType === 'Employee' || accountType === 'Admin') {
      next()
    } else {
      req.flash("notice", "You are not authorized to access this page.")
      return res.redirect("/account/")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util