
CREATE TABLE IF NOT EXISTS http_requests(
   id INT(12) PRIMARY KEY AUTO_INCREMENT,
   url_Path VARCHAR(128) NOT NULL,
   ip VARCHAR(45) NOT NULL,
   origin VARCHAR(64),
   user_agent TEXT,
   lang VARCHAR(8),
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
