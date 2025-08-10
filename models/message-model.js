const pool = require("../database/")

/* ***************************
 *  Get all messages for a user by account_id
 * ************************** */
async function getMessagesFromId(account_id) {
    try {
        const data = await pool.query(
            `SELECT 
                m.message_id, 
                m.message_subject, 
                m.message_created, 
                m.message_read, 
                a.account_firstname, 
                a.account_lastname 
             FROM public.message AS m
             JOIN public.account AS a ON m.message_from = a.account_id
             WHERE m.message_to = $1 AND m.message_archived = false
             ORDER BY m.message_created DESC`,
            [account_id]
        )
        return data.rows
    } catch (error) {
        console.error("getMessagesFromId error " + error)
        throw error
    }
}

/* ***************************
 *  Count unread messages for a user
 * ************************** */
async function countUnreadMessage(account_id) {
    try {
        const data = await pool.query(
            `SELECT COUNT(*) FROM public.message WHERE message_to = $1 AND message_read = FALSE`,
            [account_id]
        )
        return parseInt(data.rows[0].count, 10)
    } catch (error) {
        console.error("countUnreadMessage error " + error)
        throw error
    }
}

/* ***************************
 *  Get archived messages for a user
 * ************************** */
async function getArchivedMessage(account_id) {
    try {
        const data = await pool.query(
            `SELECT 
                m.message_id, 
                m.message_subject, 
                m.message_created, 
                m.message_read, 
                a.account_firstname, 
                a.account_lastname 
             FROM public.message AS m
             JOIN public.account AS a ON m.message_from = a.account_id
             WHERE m.message_to = $1 AND m.message_archived = TRUE 
             ORDER BY m.message_created DESC`,
            [account_id]
        )
        return data.rows
    } catch (error) {
        console.error("getArchivedMessage error " + error)
        throw error
    }
}

/* ***************************
 *  Send a new message
 * ************************** */
async function sendNewMessage(message_subject, message_body, message_to, message_from) {
    try {
        const sql = `INSERT INTO public.message (message_subject, message_body, message_to, message_from) 
                     VALUES ($1, $2, $3, $4) RETURNING *`
        const data = await pool.query(sql, [message_subject, message_body, message_to, message_from])
        return data.rows[0]
    } catch (error) {
        console.error("sendNewMessage error " + error)
        throw error
    }
}

/* ***************************
 *  Get a single message by message_id
 * ************************** */
async function getMessageById(message_id) {
    try {
        const data = await pool.query(
            `SELECT
                m.message_id,
                m.message_subject,
                m.message_body,
                m.message_created,
                m.message_to,
                m.message_from,
                a.account_firstname,
                a.account_lastname
             FROM public.message AS m
             JOIN public.account AS a ON m.message_from = a.account_id
             WHERE m.message_id = $1`,
            [message_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getMessageById error " + error)
        throw error
    }
}

/* ***************************
 *  Mark a message as read
 * ************************** */
async function markAsRead(message_id) {
    try {
        const sql = `UPDATE public.message SET message_read = TRUE WHERE message_id = $1 RETURNING *`
        const data = await pool.query(sql, [message_id])
        return data.rows[0]
    } catch (error) {
        console.error("markAsRead error " + error)
        throw error
    }
}

/* ***************************
 *  Mark a message as archived
 * ************************** */
async function markToArchived(message_id) {
    try {
        const sql = `UPDATE public.message SET message_archived = TRUE WHERE message_id = $1 RETURNING *`
        const data = await pool.query(sql, [message_id])
        return data.rows[0]
    } catch (error) {
        console.error("markToArchived error " + error)
        throw error
    }
}

/* ***************************
 *  Delete a message
 * ************************** */
async function deleteMessage(message_id) {
    try {
        const sql = `DELETE FROM public.message WHERE message_id = $1`
        const data = await pool.query(sql, [message_id])
        return data
    } catch (error) {
        console.error("deleteMessage error " + error)
        throw error
    }
}

module.exports = {
    getMessagesFromId,
    countUnreadMessage,
    getArchivedMessage,
    sendNewMessage,
    markAsRead,
    markToArchived,
    deleteMessage,
    getMessageById
}