UPDATE atms_db.reference
SET     
    ref_link = ?,
    ref_category = ?,
    length_in_mins = ?
WHERE
    reference_id = ?;