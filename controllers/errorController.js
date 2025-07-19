const utilities = require("../utilities/")

const errorController = {}

/* ***************************
 *  Build 404 Error Page
 * ************************** */
errorController.build404 = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.status(404).render("errors/error", {
        title: "404 - Page Not Found",
        message: "This is embarrassing... Apparently, the car you are looking for has not yet been invented.",
        imageUrl: "/images/site/error-404-honda-air-concept.webp",
        nav
    })
}

/* ***************************
 *  Build 500 Error Page (Generic Error Handler)
 * ************************** */
errorController.build500 = async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(err)
    res.status(500).render("errors/error", {
        title: "Server Error",
        message: "Sorry, a server error occurred. Someone did not plug the socket correctly, We are working to resolve it, Return to the home page.",
        imageUrl: "/images/site/error-505-not-charged.png",
        nav
    })
}

/* ***************************
 *  Trigger a 500 error for testing purposes
 * ************************** */
errorController.triggerError = async (req, res, next) => {
    try {
        throw new Error("This is an intentional 500 server error.")
    } catch (error) {
        next(error)
    }
}

module.exports = errorController