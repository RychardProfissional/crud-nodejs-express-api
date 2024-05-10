CREATE DATABASE IF NOT EXISTS  `loja`;

USE `loja`;

DROP TABLE `produtos`; -- para execução em desenvolvimento

CREATE TABLE `produtos` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `descricao` TEXT NOT NULL,
    `preco` FLOAT(10, 2) NOT NULL
);