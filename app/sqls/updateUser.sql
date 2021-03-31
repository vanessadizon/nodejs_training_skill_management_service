UPDATE atms_db.atms_user
SET 
    aws_email = ? , 
    password = ?,
    last_name = ?,
    first_name = ?,
    dev = ? 
WHERE user_id = ?