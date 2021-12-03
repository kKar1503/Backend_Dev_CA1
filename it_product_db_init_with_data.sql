CREATE DATABASE  IF NOT EXISTS `it_products` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `it_products`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: it_products
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `category` varchar(45) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Laptops','Light and high performance laptops for school'),(2,'Phones','Awesome performance phones for everything and more'),(3,'Mouses','Durable rechargeable battery mouses allow you to study for hours.'),(4,'Hard drives','Versatile and dependable hard drives'),(5,'Tablet','Outstanding visuals and advanced pen performance tablets'),(6,'Headphones','High quality wireless audio headphones');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interest`
--

DROP TABLE IF EXISTS `interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interest` (
  `interestid` int NOT NULL AUTO_INCREMENT,
  `fk_user_id` int NOT NULL,
  `fk_category_id` int NOT NULL,
  PRIMARY KEY (`interestid`),
  KEY `fk_user_id_idx` (`fk_user_id`),
  KEY `fk_category_id_idx` (`fk_category_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`fk_category_id`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interest`
--

LOCK TABLES `interest` WRITE;
/*!40000 ALTER TABLE `interest` DISABLE KEYS */;
INSERT INTO `interest` VALUES (1,3,3),(2,3,5),(3,5,5),(4,5,6),(5,6,2),(6,10,2),(7,11,4),(8,12,4),(9,13,1),(10,13,2),(11,13,3),(12,13,3),(13,15,5),(14,15,6),(15,16,1),(16,16,1),(17,16,3),(18,16,6),(19,17,5),(20,18,3),(21,19,1),(22,19,2),(23,19,2),(24,19,3),(25,20,2);
/*!40000 ALTER TABLE `interest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `categoryid` int NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`productid`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `categoryid_idx` (`categoryid`),
  CONSTRAINT `categoryid` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Surface Pro 7','Ultra-light and versatile.',1,'Microsoft',1430.00),(2,'Galaxy Book Pro','The perfect mix of portable and productive.',1,'SAMSUNG',1065.22),(3,'ThinkPad X1 Titanium Yoga','Has an impressive ultra-light chassis and titanium housing.',1,'Lenovo',3051.84),(4,'Aspire 5','Has powerful processors and graphics.',1,'Acer',841.00),(5,'MacBook Air','Active cooling system sustains incredible performance.',1,'Apple',2149.00),(6,'Samsung Galaxy S21 5G','Designed to revolutionise video and photography.',2,'SAMSUNG',1499.00),(7,'SAM GAL A52s 5G','Make multitasking even simpler with the awesome performance.',2,'SAMSUNG',504.00),(8,'iPhone 11','A new dual camera system captures more of what you see and love. ',2,'Apple',799.00),(9,'iPhone 13','A15 lightning-fast chip that leaves the competition behind. ',2,'Apple',1299.00),(10,'Pixel 3 XL','Comes with a battery that charges fast and wirelessly, and lasts all day.',2,'Google',323.59),(11,'Dark Core RGB Pro SE','Equipped with an 18000 DPI custom PixArt PAW3392 optical sensor.',3,'Corsair',162.88),(12,'RGB PRO','Equipped with a drag-reducing flexible paracord cable for responsive.',3,'Corsair',89.72),(13,'Silent Plus','Ultra-quiet mouse with 90% reduced click sound.',3,'Logitech',31.87),(14,'M585','Ultra-precise scrolling.',3,'Logitech',34.18),(15,'U7Z-00035','1TB PC Wireless Mouse with optical sensor.',3,'Microsoft',23.44),(16,'IronWolf Pro','1TB Enjoy two-yr Rescue Data Recovery Services.',4,'Seagate',173.00),(17,'One Touch HDD','2TB Store and access photos and files with Seagate One Touch.',4,'Seagate',199.00),(18,'Elements Desktop','14TB Fast data transfers.',4,'Western Digital',579.64),(19,'ST8000DM004','8TB Cost-effective 5400 RPM internal hard drive upgrade for laptop.',4,'Seagate',193.72),(20,'WDBBGB0060HBK-EESN','6TB Auto backup with included WD Backup software.',4,'Western Digital',118.39),(21,'Tab S7','11 Inches 100% with the fast charging USB C port. ',5,'Samsung',737.80),(22,'MHQU3ZP/A','11-inch Liquid Retina display with ProMotion, True Tone.',5,'Apple',1299.00),(23,'Tab A7 Lite','8.7 Inches, slim design and sturdy metal frame.',5,'Samsung',197.55),(24,'SM-T220NZAAXSP','8.7 Inches Vivid, crystal clear display paired with Stereo Sound.',5,'Samsung',215.00),(25,'AirPods Pro','Active Noise Cancellation blocks outside noise, immerse yourself in music.',5,'Apple',329.00),(26,'Surface Headphones 2','Surround yourself with spectacular Omnisonic sound for music.',6,'Microsoft',302.00),(27,'Bose Noise Cancelling Headphones 700','Powerful noise cancelling headphones: 11 levels of active noise cancelling. ',6,'Bose',479.00),(28,'Sony WH-1000XM3','HD Noise Cancelling Processor QN1 lets you listen without distractions.',6,'Sony',269.00),(29,'BOSE 789564-0010 QuietComfort 35','Alexa-enabled for voice access to music, information, and more.',6,'Bose',301.81),(30,'Jabra Elite 85t','Powerful speakers combined with voice assistant 12 mm speakers.',6,'Jabra',238.70);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `productid` int NOT NULL,
  `rating` int NOT NULL,
  `review` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  KEY `userid_idx` (`userid`),
  KEY `productid_idx` (`productid`),
  CONSTRAINT `productid` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,1,12,4,'This is a really good (product).','2021-12-02 11:05:42'),(2,1,15,2,'I heard about this from friends, decided to give it a try but didnâ€™t turn out as expected.','2021-12-02 11:05:42'),(3,1,17,1,'It broke after I barely used it.','2021-12-02 11:05:42'),(4,1,22,3,'I hope they could strengthen the packaging a bit as it feels cheap for the pricing.','2021-12-02 11:05:42'),(5,1,26,2,'Didn\'t work at all, poor quality.','2021-12-02 11:05:42'),(6,1,30,4,'This (product) works well. It does the job as it is meant to do.','2021-12-02 11:05:42'),(7,2,1,4,'I saw the (product) being displayed on the SP IT! eCommerce stall and decided to buy, did not regret it at all.','2021-12-02 11:05:42'),(8,2,12,5,'Totally recommended it!','2021-12-02 11:05:42'),(9,2,18,5,'A great tool to complement my course work.','2021-12-02 11:05:42'),(10,5,9,4,'Talk about contentment!!!','2021-12-02 11:05:42'),(11,6,19,1,'I won\'t recommend it.','2021-12-02 11:05:42'),(12,6,28,1,'The design is flawed, the grip of the (product) is bad, bad for people who have sweaty palms.','2021-12-02 11:05:42'),(13,7,8,4,'I\'m glad I bought this','2021-12-02 11:05:42'),(14,7,17,5,'Love it!','2021-12-02 11:05:42'),(15,9,10,5,'My brother loves it.','2021-12-02 11:05:42'),(16,10,20,1,'It\'s not as good as it\'s stated as it was pretty fragile.','2021-12-02 11:05:42'),(17,12,14,3,'The (product) this comes in stated dimension but weighs heavier than the stated specifications.','2021-12-02 11:05:42'),(18,14,16,1,'Don\'t buy!','2021-12-02 11:05:42'),(19,14,17,1,'My friend recommended this to me and I did not regret!','2021-12-02 11:05:42'),(20,14,18,3,'It\'s not too bad, but not the most impressive (product) I\'ve bought.','2021-12-02 11:05:42'),(21,14,22,3,'I think this is just so-so quality (product).','2021-12-02 11:05:42'),(22,14,23,2,'I hope they could improve the quality to match this high pricing','2021-12-02 11:05:42'),(23,16,2,2,'This (product) is not as impressive as advertised.','2021-12-02 11:05:42'),(24,18,13,5,'This (product) works too well. It improves my productivity by a lot.','2021-12-02 11:05:42'),(25,20,21,5,'Love the (product), I\'m glad I bought this.','2021-12-02 11:05:42');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` int NOT NULL,
  `password` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  `profile_pic_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `contact_UNIQUE` (`contact`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'carl_bond','carl_bond@gmail.com',95227120,'angrygeese11','Customer','https://www.profilepic.com/carl_bond.jpg','2021-12-02 10:05:18'),(2,'faith_hunter','faith_hunter@gmail.com',87590706,'amberbrown74','Customer','https://www.profilepic.com/faith_hunter.jpg','2021-12-02 10:05:18'),(3,'madeleine_peters','madeleine_peters@gmail.com',99974567,'greatdoe45','Customer','https://www.profilepic.com/madeleine_peters.jpg','2021-12-02 10:05:18'),(4,'paul_simpson','paul_simpson@gmail.com',94817121,'goodsky38','Customer','https://www.profilepic.com/paul_simpson.jpg','2021-12-02 10:05:18'),(5,'hannah_lambert','hannah_lambert@gmail.com',96854510,'poorray64','Customer','https://www.profilepic.com/hannah_lambert.jpg','2021-12-02 10:05:18'),(6,'jennifer_fraser','jennifer_fraser@gmail.com',91151180,'newliquid36','Customer','https://www.profilepic.com/jennifer_fraser.jpg','2021-12-02 10:05:18'),(7,'stewart_hodges','stewart_hodges@gmail.com',91907471,'thinlock80','Customer','https://www.profilepic.com/stewart_hodges.jpg','2021-12-02 10:05:18'),(8,'john_mclean','john_mclean@gmail.com',83386680,'lightriver30','Customer','https://www.profilepic.com/john_mclean.jpg','2021-12-02 10:05:18'),(9,'julian_metcalfe','julian_metcalfe@gmail.com',84634582,'shinycoral95','Customer','https://www.profilepic.com/julian_metcalfe.jpg','2021-12-02 10:05:18'),(10,'faith_henderson','faith_henderson@gmail.com',86499750,'firstpig96','Customer','https://www.profilepic.com/faith_henderson.jpg','2021-12-02 10:05:18'),(11,'karen_edmunds','karen_edmunds@gmail.com',95955549,'emptyolive76','Customer','https://www.profilepic.com/karen_edmunds.jpg','2021-12-02 10:05:18'),(12,'sophie_reid','sophie_reid@gmail.com',85475250,'jumpykitten65','Customer','https://www.profilepic.com/sophie_reid.jpg','2021-12-02 10:05:18'),(13,'paul_greene','paul_greene@gmail.com',83900066,'supershape58','Customer','https://www.profilepic.com/paul_greene.jpg','2021-12-02 10:05:18'),(14,'jason_wilkins','jason_wilkins@gmail.com',94873656,'nicedress39','Customer','https://www.profilepic.com/jason_wilkins.jpg','2021-12-02 10:05:18'),(15,'nathan_morgan','nathan_morgan@gmail.com',95841000,'loudland48','Customer','https://www.profilepic.com/nathan_morgan.jpg','2021-12-02 10:05:18'),(16,'paul_brown','paul_brown@gmail.com',97826712,'uglyjump75','Customer','https://www.profilepic.com/paul_brown.jpg','2021-12-02 10:05:18'),(17,'diane_scott','diane_scott@gmail.com',91351285,'wildpage77','Customer','https://www.profilepic.com/diane_scott.jpg','2021-12-02 10:05:18'),(18,'karen_poole','karen_poole@gmail.com',96088828,'messyjump50','Admin','https://www.profilepic.com/karen_poole.jpg','2021-12-02 10:05:18'),(19,'tracey_jackson','tracey_jackson@gmail.com',87575100,'cutebeam94','Admin','https://www.profilepic.com/tracey_jackson.jpg','2021-12-02 10:05:18'),(20,'victor_graham','victor_graham@gmail.com',88071160,'redhill85','Admin','https://www.profilepic.com/victor_graham.jpg','2021-12-02 10:05:18');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-02 19:08:15
