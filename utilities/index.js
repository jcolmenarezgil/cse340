const invModel = require("../models/inventory-model")
const Util = {}

/* ***************************
*  Build inventory by classification view
* ************************** */
Util.getNav = async function (req, res, next) {
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

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="inv-list-item">'
      grid +=  '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + 'details"><img src="' + vehicle.inv_thumbnail + '" title="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" alt="'+ vehicle.inv_make + '_' + vehicle.inv_model + '" loading="lazy" />'
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
Util.buildItemDetailView = async function(data){
  let grid_detail
  if(data.length > 0){
    grid_detail = '<div id="item-detail">'
    data.forEach(detail => {
      grid_detail += '<div class="detail-image">'
      grid_detail += '<img src="' + detail.inv_image + '" title="Details of ' + detail.inv_model  + ' ' + detail.inv_make + ' on CSE Motors" alt="' + detail.inv_make + '_' + detail.inv_model + '" loading="lazy">'
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util