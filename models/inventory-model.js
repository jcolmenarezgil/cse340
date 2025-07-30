const pool = require("../database/")

/* **************************************
 * Get all classification data using external URL from Render.com
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
        throw error
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
        throw error
    }
}

/* **************************************
 * Insert New Vehicle into public.inventory 
 * ************************************** */
async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = `INSERT INTO public.inventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
    } catch (error) {
        console.error("addInventory error " + error)
        throw error
    }
}

/* **************************************
 * Insert New Classification into public.inventory
 * ************************************** */
async function addClassification(classification_name) {
    try {
        const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`
        return await pool.query(sql, [classification_name])

    } catch (error) {
        console.error("addClassification error " + error)
        throw error
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getItemDetailById, addInventory, addClassification }