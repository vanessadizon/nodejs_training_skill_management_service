SELECT
    user_id, password
FROM
    atms_db.atms_user
WHERE
    user_id = ?
    AND
    password = ?;