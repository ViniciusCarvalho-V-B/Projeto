-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: comercial_alfa
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cnpj` varchar(14) NOT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedores`
--

LOCK TABLES `fornecedores` WRITE;
/*!40000 ALTER TABLE `fornecedores` DISABLE KEYS */;
INSERT INTO `fornecedores` VALUES (1,'Tech Import','12345678000101','São Paulo'),(2,'Eletro Distribuidora','98765432000102','Rio de Janeiro'),(3,'Componentes Brasil','45678913000104','Belo Horizonte'),(4,'americanas','71024714000188','Guaratinguetá'),(5,'Magazine','08545825000101','Guaratinguetá'),(6,'PC Peças Distribuidora','55123456000110','Curitiba'),(7,'Importa Telas LTDA','66987654000120','Manaus');
/*!40000 ALTER TABLE `fornecedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `id_produto` int NOT NULL,
  `quantidade` int NOT NULL,
  `id_fornecedor` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_produto` (`id_produto`),
  KEY `id_fornecedor` (`id_fornecedor`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`codigo`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedores` (`id`),
  CONSTRAINT `pedidos_chk_1` CHECK ((`quantidade` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,'2025-06-10',1,2,1),(2,'2025-06-12',2,5,2),(3,'2025-06-15',3,3,3),(4,'2025-06-24',1,5,1),(5,'2025-05-24',1,4,1),(6,'2025-06-24',1,1,1),(7,'2025-06-24',1,1,1),(8,'2025-06-24',4,10,4),(9,'2025-06-25',4,5,4),(10,'2025-06-24',4,5,5),(11,'2025-04-15',1,10,1),(12,'2025-04-22',5,15,7),(13,'2025-05-05',2,30,2),(14,'2025-05-10',3,20,1),(15,'2025-05-18',6,25,2),(16,'2025-06-08',1,8,1),(17,'2025-06-14',8,10,3);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `codigo` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `estoque` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Notebook Dell','Eletrônicos',3500.00,10),(2,'Mouse Sem Fio','Acessórios',120.50,50),(3,'Teclado Mecânico','Acessórios',250.00,30),(4,'Processador','Tecnologia',800.00,10),(5,'Monitor 24\"','Monitores',850.00,25),(6,'Webcam Full HD','Acessórios',180.00,40),(7,'SSD 1TB','Componentes',450.00,35),(8,'Cadeira Gamer','Móveis',950.00,15);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24 22:36:14
