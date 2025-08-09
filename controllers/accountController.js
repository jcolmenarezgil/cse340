const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Account view
* *************************************** */
accountCont.buildAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  let accountManagement = `<div class="account-management span_2">`
  accountManagement += `<h2>Welcome ${accountData.account_firstname}</h2>`
  accountManagement += '<h3>Account Management</h3>'
  accountManagement += `<p><a href="/account/update-account/${accountData.account_id}" title="Click to update account information.">Update Account Information</a></p>`
  if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
    accountManagement += '<h3>Inventory Management</h3>'
    accountManagement += '<p><a href="/inv/management" title="Click to manage inventory.">Go to Inventory Management</a></p>'
  }
  accountManagement += `</div>`
  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null,
    accountManagement,
  })
}

/* ****************************************
*  Deliver Account Update view
* *************************************** */
accountCont.buildUpdateAccountView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const data = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
  })
}

/* ****************************************
*  Process login request
* *************************************** */
accountCont.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    return res.redirect("/account")
  } else {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword 
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process logout request
* *************************************** */
accountCont.accountLogout = (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

/* ****************************************
*  Process Account Info Update
* *************************************** */
accountCont.updateAccountInfo = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccountInfo(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        const accountData = await accountModel.getAccountById(account_id)
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        req.flash("notice", "Your account information has been updated.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}

/* ****************************************
*  Process Password Update
* *************************************** */
accountCont.updatePassword = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body

    let hashedPassword
    try {
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password update.')
        const data = await accountModel.getAccountById(account_id)
        res.status(500).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            account_firstname: data.account_firstname,
            account_lastname: data.account_lastname,
            account_email: data.account_email,
            account_id,
        })
    }

    const updateResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (updateResult) {
        req.flash("notice", "Your password has been updated.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the password update failed.")
        const data = await accountModel.getAccountById(account_id)
        res.status(501).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            account_firstname: data.account_firstname,
            account_lastname: data.account_lastname,
            account_email: data.account_email,
            account_id,
        })
    }
}

module.exports = accountCont 