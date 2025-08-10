const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")

const messageCont = {}

/* ****************************************
*  Build inbox grid view
* *************************************** */
messageCont.buildInboxGrid = async function (accountData) {
    let grid = '<div class="inbox-container">'
    grid += '<div class="inbox-controls">'
    grid += '<h3>Main Menu</h3>'
    grid += '<a href="/message/new" title="Create a new message">Create New Message</a>'
    
    const archivedMessages = await messageModel.getArchivedMessage(accountData.account_id)
    if (archivedMessages.length > 0) {
        grid += `<a href="/message/archive" title="View archived messages">View ${archivedMessages.length} Archived Message(s)</a>`
    }
    grid += '</div>'

    const inboxData = await messageModel.getMessagesFromId(accountData.account_id)
    
    if (inboxData.length > 0) {
        grid += '<h3>Summary</h3>'
        grid += '<table id="inbox-table">'
        grid += '<thead>'
        grid += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'
        grid += '</thead>'
        grid += '<tbody>'
        inboxData.forEach(message => {
            grid += `<tr class="${message.message_read ? 'read' : 'unread'}">`
            grid += `<td>${new Date(message.message_created).toLocaleDateString("en-US")}</td>`
            grid += `<td><a href="/message/read/${message.message_id}">${message.message_subject}</a></td>`
            grid += `<td>${message.account_firstname} ${message.account_lastname}</td>`
            grid += `<td><p class="${message.message_read}">${message.message_read}</p></td>`
            grid += '</tr>'
        })
        grid += '</tbody>'
        grid += '</table>'
        grid += '</div>'
    } else {
        grid += '<p class="notice">You have no messages in your inbox.</p>'
    }
    return grid
}

/* ****************************************
*  Deliver inbox view
* *************************************** */
messageCont.buildInbox = async function (req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData
    const inbox = await messageCont.buildInboxGrid(accountData)
    res.render("inbox/index", {
        title: `${accountData.account_firstname} ${accountData.account_lastname}'s Inbox`,
        nav,
        inbox,
        errors: null,
    })
}

/* ****************************************
*  Deliver compose message view
* *************************************** */
messageCont.buildComposeMessage = async function (req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData
    const recipientList = await utilities.buildRecipientList(accountData.account_id)
    res.render("inbox/compose", {
        title: "Compose a New Message",
        nav,
        errors: null,
        recipientList,
    })
}

/* ****************************************
*  Deliver archived messages view
* *************************************** */
messageCont.buildArchived = async function (req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData
    const archiveGrid = await messageCont.buildArchiveGrid(accountData)
    res.render("inbox/archive", {
        title: "Archived Messages",
        nav,
        errors: null,
        archiveView: archiveGrid,
    })
}

/* ****************************************
*  Build archive grid view (Helper)
* *************************************** */
messageCont.buildArchiveGrid = async function (accountData) {
    const archivedData = await messageModel.getArchivedMessage(accountData.account_id)
    if (archivedData.length > 0) {
        // Re-use the inbox grid builder logic for consistency
        return utilities.buildMessageGrid(archivedData, "Archived Messages")
    } else {
        return '<p class="notice">You have no archived messages.</p>'
    }
}

/* ****************************************
*  Deliver reading message view
* *************************************** */
messageCont.buildReadingMessage = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const messageData = await messageModel.getMessageById(message_id)
    const account_id = res.locals.accountData.account_id

    if (!messageData || messageData.message_to !== account_id) {
        req.flash("notice", "Sorry, you are not authorized to view this message.")
        return res.redirect("/message")
    }

    // Mark the message as read
    await messageModel.markAsRead(message_id)

    let nav = await utilities.getNav()
    let messageView = `
        <div class="message-header">
            <p><strong>Date:</strong> ${new Date(messageData.message_created).toLocaleString()}</p>
            <p><strong>From:</strong> ${messageData.account_firstname} ${messageData.account_lastname}</p>
        </div>
        <hr>
        <div class="message-body"><p>${messageData.message_body}</p></div>
        <hr>
        <div class="message-options">
            <a href="/message">Return to Inbox</a>
            <a href="/message/reply/${message_id}" title="Reply to this message">Reply</a>
            <form action="/message/archive/${message_id}" method="post" class="inline-form"><button type="submit">Archive Message</button></form>
            <a href="/message/delete/${message_id}" class="delete-link">Delete Message</a>
        </div>
    `
    res.render("inbox/read", { title: messageData.message_subject, nav, errors: null, messageView })
}

/* ****************************************
*  Deliver reply message view
* *************************************** */
messageCont.buildReplyView = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const messageData = await messageModel.getMessageById(message_id)
    const account_id = res.locals.accountData.account_id

    // Security check: Ensure the user replying is the one who received the message
    if (!messageData || messageData.message_to !== account_id) {
        req.flash("notice", "Sorry, you are not authorized to reply to this message.")
        return res.redirect("/message")
    }

    let nav = await utilities.getNav()
    const recipientList = await utilities.buildRecipientList(account_id, messageData.message_from)
    const subject = messageData.message_subject.startsWith("RE: ") ? messageData.message_subject : `RE: ${messageData.message_subject}`
    const body = `\n\n\n---- Original Message ----\nFrom: ${messageData.account_firstname} ${messageData.account_lastname}\nSent: ${new Date(messageData.message_created).toLocaleString()}\nSubject: ${messageData.message_subject}\n\n${messageData.message_body}`

    res.render("inbox/compose", {
        title: "Reply to Message",
        nav,
        errors: null,
        recipientList,
        message_subject: subject,
        message_body: body,
    })
}

/* ****************************************
*  Deliver delete confirmation view
* *************************************** */
messageCont.buildDeleteConfirm = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const messageData = await messageModel.getMessageById(message_id)
    const account_id = res.locals.accountData.account_id

    // Security check: Ensure the message belongs to the logged-in user
    if (!messageData || messageData.message_to !== account_id) {
        req.flash("notice", "Sorry, you are not authorized to view this page.")
        return res.redirect("/message")
    }

    let nav = await utilities.getNav()
    res.render("inbox/delete-confirm", {
        title: "Confirm Message Deletion",
        nav,
        errors: null,
        message_subject: messageData.message_subject,
        message_from: `${messageData.account_firstname} ${messageData.account_lastname}`,
        message_created: new Date(messageData.message_created).toLocaleString(),
        message_id: messageData.message_id,
    })
}

/* ****************************************
*  Process new message
* *************************************** */
messageCont.processNewMessage = async function (req, res, next) {
    const { message_to, message_subject, message_body } = req.body
    const message_from = res.locals.accountData.account_id

    const sendResult = await messageModel.sendNewMessage(
        message_subject,
        message_body,
        message_to,
        message_from
    )

    if (sendResult) {
        req.flash("notice", "Your message has been sent successfully.")
        res.redirect("/message")
    } else {
        let nav = await utilities.getNav()
        const recipientList = await utilities.buildRecipientList(message_from, message_to)
        req.flash("notice", "Sorry, there was an error sending your message.")
        res.status(501).render("inbox/compose", {
            title: "Compose a New Message",
            nav,
            errors: null,
            recipientList,
            message_subject,
            message_body,
        })
    }
}

/* ****************************************
*  Process archiving a message
* *************************************** */
messageCont.processArchiveMessage = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const account_id = res.locals.accountData.account_id

    // Security check: Ensure the user owns the message
    const messageData = await messageModel.getMessageById(message_id)
    if (!messageData || messageData.message_to !== account_id) {
        req.flash("notice", "Sorry, you are not authorized to perform this action.")
        return res.redirect("/message")
    }

    const archiveResult = await messageModel.markToArchived(message_id)
    if (archiveResult) {
        req.flash("notice", "The message has been successfully archived.")
    } else {
        req.flash("notice", "Sorry, the message could not be archived.")
    }
    res.redirect("/message")
}

/* ****************************************
*  Process deleting a message
* *************************************** */
messageCont.processDeleteMessage = async function (req, res, next) {
    const message_id = parseInt(req.body.message_id)
    const account_id = res.locals.accountData.account_id

    // Security check: Ensure the user owns the message before deleting
    const messageData = await messageModel.getMessageById(message_id)
    if (!messageData || messageData.message_to !== account_id) {
        req.flash("notice", "Sorry, you are not authorized to perform this action.")
        return res.redirect("/message")
    }

    const deleteResult = await messageModel.deleteMessage(message_id)

    if (deleteResult) {
        req.flash("notice", "The message has been successfully deleted.")
    } else {
        req.flash("notice", "Sorry, the message could not be deleted.")
    }
    res.redirect("/message")
}

module.exports = messageCont