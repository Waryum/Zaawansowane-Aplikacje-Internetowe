# creating a Database named db_test

# CREATE DATABASE IF NOT EXISTS db_test CHARACTER SET 'utf8mb4';

# Creating a table for series

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


# Creating a table for sensors

CREATE TABLE IF NOT EXISTS sensors (
                                       id INT NOT NULL AUTO_INCREMENT,
                                       name VARCHAR(100) NOT NULL,
    seriesId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastMeasurementAt DATETIME NULL,
    apiKeyHash CHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY (id),
    CONSTRAINT sensorsIdConnection FOREIGN KEY (seriesId) REFERENCES series (id) ON DELETE CASCADE,
    CONSTRAINT checkSensorNameLength CHECK (CHAR_LENGTH(name) > 0)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


#For Testing purposes
#DROP TABLE IF EXISTS series;

