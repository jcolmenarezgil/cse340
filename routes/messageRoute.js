// Needed Resources
const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/msgController")
const utilities = require("../utilities/")
const msgValidate = require('../utilities/message-validation')

// Default route to inbox
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildInbox)
);

// Route to build the view for a new message
router.get(
    "/new",
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildComposeMessage)
);

// Route to view archived messages
router.get(
    "/archive",
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildArchived)
);

// Route to view a specific message
router.get(
    "/read/:message_id",
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildReadingMessage)
);

// Route to build the reply view
router.get(
    "/reply/:message_id",
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildReplyView)
);

// Route to display delete confirmation view
router.get(
    "/delete/:message_id",
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildDeleteConfirm)
);

// Process sending a new message
router.post(
    "/new",
    utilities.checkLogin,
    msgValidate.newMessageRules(),
    msgValidate.checkNewMessageData,
    utilities.handleErrors(messageController.processNewMessage)
);

// Process archiving a message
router.post(
    "/archive/:message_id",
    utilities.checkLogin,
    utilities.handleErrors(messageController.processArchiveMessage)
);

// Process deleting a message
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.handleErrors(messageController.processDeleteMessage)
);

module.exports = router;