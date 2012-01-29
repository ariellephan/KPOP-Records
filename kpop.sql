-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 29, 2012 at 03:55 AM
-- Server version: 5.1.44
-- PHP Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `kpop`
--

-- --------------------------------------------------------

--
-- Table structure for table `kpop`
--

CREATE TABLE IF NOT EXISTS `kpop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `year` varchar(45) DEFAULT NULL,
  `topalbum` varchar(45) DEFAULT NULL,
  `debut` varchar(45) DEFAULT NULL,
  `topsingle` varchar(45) DEFAULT NULL,
  `description` blob,
  `picture` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=54 ;

--
-- Dumping data for table `kpop`
--

INSERT INTO `kpop` (`id`, `name`, `year`, `topalbum`, `debut`, `topsingle`, `description`, `picture`) VALUES
(1, 'SNSD', '2007', 'Genie', 'Into the New World', 'Gee', 0x4f6e65206f6620746f70206769726c2067726f75707320696e204b6f726561, 'snsd.jpg'),
(2, 'Secret', '2010', 'Secret Times', 'Shy Boys', NULL, '', 'secret.jpg'),
(41, '2NE1', '2010', 'I am the best', 'Fire', NULL, '', '2NE1.jpg'),
(42, 'Wondergirl', '2007', 'The Wonder Years ', 'Tell me', NULL, '', 'Wondergirl.jpg'),
(53, 'IU', '', 'Good Day', 'Nagging', NULL, '', 'IU.jpg');
