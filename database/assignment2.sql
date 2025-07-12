-- 1. Insert Tony Strack into the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES 
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update the account type for Tony Stark to Admin
UPDATE public.account SET account_type = 'admin' WHERE account_id = 1 AND account_email = 'tony@starkent.com';

-- 3. Delete the account Tony Stark by id and email
DELETE FROM public.account WHERE account_id = 1 AND account_email = 'tony@starkent.com';

-- 4. Modify 'small interiors' to 'a huge interior' in the description of the Hummer
UPDATE public.inventory SET inv_description =  REPLACE(inv_description, 'small interiors', 'a huge interior') WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Inner Join to get inv_make, inv_model, and classification_name for 'Sport' classification
SELECT inv_make, inv_model, classification_name FROM inventory i INNER JOIN classification c ON i.classification_id = c.classification_id WHERE c.classification_name = 'Sport';

-- 6. Update images paths for inventory table for inv_images and inv_thumbnail
UPDATE public.inventory SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles');