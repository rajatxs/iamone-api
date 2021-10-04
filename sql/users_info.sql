
CREATE TABLE IF NOT EXISTS users_info(
   id INT(8) PRIMARY KEY AUTO_INCREMENT,
   fullname VARCHAR(100) NOT NULL,
   bio TEXT,
   company VARCHAR(160),
   cred_id INT(8) NOT NULL REFERENCES user_cred(id),
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
