const pool = require("../database/")

/* **************************************
 * Get all classification data usind external URL from Render.com
 * ************************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* **************************************
 * Get all inventory items and classification_name by classification_id
 * ************************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error " + error)
    }
}

/* **************************************
 * Get all item detail by itemdetail_id
 * ************************************** */
async function getItemDetailById(itemdetail_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [itemdetail_id]
        )
        return data.rows
    } catch (error) {
        console.error("getItemDetailById error " + error)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getItemDetailById }