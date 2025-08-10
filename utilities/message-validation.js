const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  New Message Data Validation Rules
  * ********************************* */
validate.newMessageRules = () => {
    return [
        // message_to is required and must be a number
        body("message_to")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("Please select a recipient."),

        // message_subject is required and will be escaped
        body("message_subject")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a subject."),

        // message_body is required and will be escaped
        body("message_body")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a message body."),
    ]
}

/* ******************************
* Check new message data and return errors or continue
* ***************************** */
validate.checkNewMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = res.locals.accountData
        const recipientList = await utilities.buildRecipientList(accountData.account_id, message_to)
        res.render("inbox/compose", { title: "Compose a New Message", nav, errors, recipientList, message_subject, message_body })
        return
    }
    next()
}

module.exports = validate