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
 * Update Vehicle stored in public.inventory 
 * ************************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("updateInventory error: " + error)
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

/* **************************************
 * Delete inventory item from public.inventory
 * ************************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = `DELETE FROM public.inventory WHERE inv_id = $1`
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        new Error("Delete Inventory Item Error")
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getItemDetailById, addInventory, addClassification, updateInventory, deleteInventoryItem }