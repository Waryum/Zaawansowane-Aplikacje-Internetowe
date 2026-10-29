CREATE TABLE IF NOT EXISTS series (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    lowestValue DOUBLE NOT NULL,
    highestValue DOUBLE NOT NULL,
    unit VARCHAR(20) NULL,
    color CHAR(7) NOT NULL,
    icon VARCHAR(50) NULL,
    PRIMARY KEY (id),
    CONSTRAINT checkSeriesRange CHECK (lowestValue < highestValue),
    CONSTRAINT checkSeriesNameLength CHECK (CHAR_LENGTH(name) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS sensors (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    seriesId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastMeasurementAt DATETIME NULL,
    apiKeyHash CHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY (id),
    CONSTRAINT fkSensorsSeries FOREIGN KEY (seriesId) REFERENCES series (id) ON DELETE CASCADE,
    CONSTRAINT checkSensorNameLength CHECK (CHAR_LENGTH(name) > 0),
    CONSTRAINT checkSensorKeyHashLength CHECK (CHAR_LENGTH(apiKeyHash) = 64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS measurements (
    id INT NOT NULL AUTO_INCREMENT,
    seriesId INT NOT NULL,
    sensorId INT NULL,
    value DOUBLE NOT NULL,
    timestamp DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    INDEX idxMeasurementsSeriesTime (seriesId, timestamp),
    CONSTRAINT fkMeasurementsSeries FOREIGN KEY (seriesId) REFERENCES series (id) ON DELETE CASCADE,
    CONSTRAINT fkMeasurementsSensors FOREIGN KEY (sensorId) REFERENCES sensors (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS admins (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT checkUsernameLength CHECK (CHAR_LENGTH(username) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS tokens (
    id INT NOT NULL AUTO_INCREMENT,
    adminId INT NOT NULL,
    tokenHash CHAR(64) NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fkTokensAdmins FOREIGN KEY (adminId) REFERENCES admins (id) ON DELETE CASCADE,
    CONSTRAINT checkTokenHashLength CHECK (CHAR_LENGTH(tokenHash) = 64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;