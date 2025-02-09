-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema fireboxgo
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `fireboxgo` ;

-- -----------------------------------------------------
-- Schema fireboxgo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fireboxgo` DEFAULT CHARACTER SET utf8 ;
USE `fireboxgo` ;

-- -----------------------------------------------------
-- Table `fireboxgo`.`accounts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`accounts` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`accounts` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `FIRST_NAME` VARCHAR(50) NOT NULL,
  `LAST_NAME` VARCHAR(50) NOT NULL,
  `EMAIL` VARCHAR(50) NOT NULL,
  `USERNAME` VARCHAR(50) NOT NULL,
  `PASSWORD` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fireboxgo`.`files`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`files` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`files` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `FILE_NAME` VARCHAR(500) NOT NULL,
  `FILE` LONGBLOB NOT NULL,
  `accounts_ID` INT(11) NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_files_accounts1_idx` (`accounts_ID` ASC),
  CONSTRAINT `fk_files_accounts1`
    FOREIGN KEY (`accounts_ID`)
    REFERENCES `fireboxgo`.`accounts` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fireboxgo`.`rooms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`rooms` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`rooms` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `ROOM_NAME` VARCHAR(100) NOT NULL,
  `DESCRIPTION` VARCHAR(500) NOT NULL,
  `accounts_ID` INT(11) NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_rooms_accounts1_idx` (`accounts_ID` ASC),
  CONSTRAINT `fk_rooms_accounts1`
    FOREIGN KEY (`accounts_ID`)
    REFERENCES `fireboxgo`.`accounts` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fireboxgo`.`items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`items` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`items` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `ITEM_NAME` VARCHAR(500) NOT NULL,
  `PURCHASE_DATE` DATE NOT NULL,
  `PURCHASE_PRICE` DECIMAL(10,2) NOT NULL,
  `RETAIL_PRICE` DECIMAL(10,2) NOT NULL,
  `DESCRIPTION` VARCHAR(500) NOT NULL,
  `OWNERSHIP_AGE` INT(10) NOT NULL,
  `IMAGE` BLOB NOT NULL,
  `rooms_ID` INT(11) NOT NULL,
  `accounts_ID` INT(11) NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_items_rooms1_idx` (`rooms_ID` ASC),
  INDEX `fk_items_accounts1_idx` (`accounts_ID` ASC),
  CONSTRAINT `fk_items_accounts1`
    FOREIGN KEY (`accounts_ID`)
    REFERENCES `fireboxgo`.`accounts` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_items_rooms1`
    FOREIGN KEY (`rooms_ID`)
    REFERENCES `fireboxgo`.`rooms` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fireboxgo`.`tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`tags` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`tags` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `TAG_NAME` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fireboxgo`.`item_taggings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`item_taggings` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`item_taggings` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `items_ID` INT(11) NOT NULL,
  `tags_ID` INT(11) NOT NULL,
  `accounts_ID` INT(11) NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_item_taggings_items1_idx` (`items_ID` ASC),
  INDEX `fk_item_taggings_tags1_idx` (`tags_ID` ASC),
  INDEX `fk_item_taggings_accounts1_idx` (`accounts_ID` ASC),
  CONSTRAINT `fk_item_taggings_accounts1`
    FOREIGN KEY (`accounts_ID`)
    REFERENCES `fireboxgo`.`accounts` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_item_taggings_items1`
    FOREIGN KEY (`items_ID`)
    REFERENCES `fireboxgo`.`items` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_item_taggings_tags1`
    FOREIGN KEY (`tags_ID`)
    REFERENCES `fireboxgo`.`tags` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fireboxgo`.`room_taggings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fireboxgo`.`room_taggings` ;

CREATE TABLE IF NOT EXISTS `fireboxgo`.`room_taggings` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `rooms_ID` INT(11) NOT NULL,
  `tags_ID` INT(11) NOT NULL,
  `accounts_ID` INT(11) NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_room_taggings_rooms1_idx` (`rooms_ID` ASC),
  INDEX `fk_room_taggings_tags1_idx` (`tags_ID` ASC),
  INDEX `fk_room_taggings_accounts1_idx` (`accounts_ID` ASC),
  CONSTRAINT `fk_room_taggings_accounts1`
    FOREIGN KEY (`accounts_ID`)
    REFERENCES `fireboxgo`.`accounts` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_room_taggings_rooms1`
    FOREIGN KEY (`rooms_ID`)
    REFERENCES `fireboxgo`.`rooms` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_room_taggings_tags1`
    FOREIGN KEY (`tags_ID`)
    REFERENCES `fireboxgo`.`tags` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
