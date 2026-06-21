-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2026 at 09:09 AM
-- Server version: 10.11.5-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vendorsdmrc`
--

-- --------------------------------------------------------

--
-- Table structure for table `electricals_material_old`
--

CREATE TABLE `electricals_material_old` (
  `id` int(11) NOT NULL,
  `s_no` varchar(10) NOT NULL,
  `item_name` text NOT NULL,
  `assignTo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `electricals_material_old`
--

INSERT INTO `electricals_material_old` (`id`, `s_no`, `item_name`, `assignTo`) VALUES
(1, 'E1', '33 kV, single core, Aluminium/Copper conductor, PVC sheathed, XLPE Insulated, 300/400 sqmm Power Cables', ''),
(2, 'E2', '25 kV, single core, Aluminium/Copper conductor, PVC sheathed, XLPE Insulated, 240/400 sqmm Power Cables', ''),
(3, 'E3', '3.3 kV return cable Aluminium conductor, PVC sheathed, XLPE insulated, 400 sqmm Return cable', ''),
(4, 'E4', '33 kV STJ / Cable Terminations', ''),
(5, 'E5', '25 kV STJ / Cable Terminations', ''),
(6, 'E6', '3.3 kV STJ / Cable Terminations', ''),
(7, 'E7', 'LA (Composite Insulation) for 33 kV panel', ''),
(8, 'E8', 'LA (Composite Insulation) for 25 kV System', ''),
(9, 'E9', '33 kV, Dry Cast resin Inductive PT', ''),
(10, 'E10', '33 kV, Dry Cast resin Inductive CT', ''),
(11, 'E11', '33kV/415V, 200kVA–3150kVA, Dry cast resin Auxiliary Transformers', ''),
(12, 'E12', '33 kV HT Panel with Vacuum Circuit Breaker and associated protection system', ''),
(13, 'E13', 'Float Cum Boost Battery Charger (Vdc = 110V)', ''),
(14, 'E14', 'Ni Cd Battery Bank', ''),
(15, 'E15', '25kV PTFE type Short Neutral Section', ''),
(16, 'E16', '107/150 sqmm Contact Wire (Cu-Ag / Cu ETP)', ''),
(17, 'E17', '65/120 sqmm Messenger Wire (Cu-Mg / Cu-Cd)', ''),
(18, 'E18', '93.3 sqmm ACSR / 240 sqmm AAC for RC, OPC and BEC', ''),
(19, 'E19', 'Section Insulators in Depot', ''),
(20, 'E20', 'MS Cantilever for Tramway type 25kV OHE', ''),
(21, 'E21', 'Modular type 25kV Aluminium Cantilever for main line', ''),
(22, 'E22', 'Mast & Fittings for 25kV OHE', ''),
(23, 'E23', 'Remote Terminal Units (RAM 256MB)', ''),
(24, 'E24', '33 kV GIS Panel', ''),
(25, 'E25', '25 kV, Dry Cast resin Inductive PT', ''),
(26, 'E26', '25 kV, Dry Cast resin Inductive CT', ''),
(27, 'E27', '25 kV Isolators motorised/manual with composite insulators of 1600 mm creepage', ''),
(28, 'E28', '25 kV magnetic actuated / mechanical actuated Pole mounted CB/BM', ''),
(29, 'E29', '25 kV, 1600 mm CD Composite Post Insulator', ''),
(30, 'E30', '25 kV, 1600 mm CD Composite Operating Rod Insulator', ''),
(31, 'E31', '25 kV, 1600 mm minimum CD Composite bracket and stay insulators for Aluminium Cantilevers', ''),
(32, 'E32', '220 / 132 / 66 kV EHV Power Cable', ''),
(33, 'E33', '220 / 132 / 66 kV EHV Power Cable Termination & Straight Through Joint', ''),
(34, 'E34', '66 kV Gas Insulated Switchgear (GIS)', ''),
(35, 'E35', '25 kV Gas Insulated Switchgear (GIS)', ''),
(36, 'E36', '220 / 132 / 66 kV // 33 kV Auxiliary Mains Transformer (AT)', ''),
(37, 'E37', '220 / 132 / 66 kV // 27.5 kV Traction Transformer (TT)', ''),
(38, 'E38', '220 kV Current Transformer (CT)', ''),
(39, 'E39', '132 kV Current Transformer (CT)', ''),
(40, 'E40', '66 kV Current Transformer (CT)', ''),
(41, 'E41', '220 kV Capacitive Voltage Transformer (CVT)', ''),
(42, 'E42', '132 kV Capacitive Voltage Transformer (CVT)', ''),
(43, 'E43', '66 kV Capacitive Voltage Transformer (CVT)', ''),
(44, 'E44', '220 kV Lightning Arrestors (Composite type)', ''),
(45, 'E45', '132 kV Lightning Arrestors (Composite type)', ''),
(46, 'E46', '66 kV Lightning Arrestors (Composite type)', ''),
(47, 'E47', '220 kV Circuit Breaker (CB)', ''),
(48, 'E48', '132 kV Circuit Breaker (CB)', ''),
(49, 'E49', '66 kV Circuit Breaker (CB)', ''),
(50, 'E50', '220 / 132 / 66 kV Isolator', ''),
(51, 'E51', 'Relays (Bay Controller Unit and Protection Relay on IEC 61850 protocol)', ''),
(52, 'E52', 'Sub-Station Automation (SAS) on IEC 61850 protocol', ''),
(53, 'E53', 'NGR', ''),
(54, 'E54', 'Electrical Panels / Distribution Boards', ''),
(55, 'E55', 'Fire Fighting Pumps (Fire Services)', ''),
(56, 'E56', 'Addressable Fire Detection System', ''),
(57, 'E57', 'Clean Agent based Fire Suppression System for Panels (Inert Gas IG-100 based)', ''),
(58, 'E58', 'LT Cu and Al Cables for Underground Work', ''),
(59, 'E59', 'Wires for Underground Work and BMS Control Cables', ''),
(60, 'E60', 'UPS (60 KVA and above)', ''),
(61, 'E61', 'Battery (NiCd) for UPS', ''),
(62, 'E62', 'LED Light Fixtures (Indoor Application)', ''),
(63, 'E63', 'LED Light Fixtures (Outdoor Application)', ''),
(64, 'E64', 'MS & GI Pipes', ''),
(65, 'E65', 'Sewage Pumps Submerged Semi Open Impeller / Seepage Pumps', ''),
(66, 'E66', 'LT Bus Duct (Sandwich type)', ''),
(67, 'E67', 'DG Sets', ''),
(68, 'E68', 'Air Conditioning System (VRF & Split)', ''),
(69, 'E69', 'FRLSH XLPE Cable', ''),
(70, 'E70', 'FRLSH PVC Cables / FR Wire', ''),
(71, 'E71', 'Water Cooled Screw / Centrifugal Chillers', ''),
(72, 'E72', 'Air Cooled Screw Chillers', ''),
(73, 'E73', 'ECS Pumps (Vertical Inline / Monoblock / Horizontal Split Case)', ''),
(74, 'E74', 'Variable Speed Distributed AHU’s and FCU Pumps', ''),
(75, 'E75', 'ECS Fans (Axial / Inline / Wall Mounted)', ''),
(76, 'E76', 'Air Handling Unit (Plug Fans with Permanent Magnet Motor)', ''),
(77, 'E77', 'ECS Sound Attenuator', ''),
(78, 'E78', 'Fire Dampers (MFD / FLFD / FMD)', ''),
(79, 'E79', 'Prefabricated Ducts', ''),
(80, 'E80', 'VFD', ''),
(81, 'E81', 'PLC based BMS for Building Services', ''),
(82, 'E82', 'Tunnel Ventilation Fan with fire rating of 250°C for 2 Hrs', ''),
(83, 'E83', 'TVS Sound Attenuator with fire rating of 250°C for 2 Hrs', ''),
(84, 'E84', 'Air Compressor', ''),
(85, 'E85', 'Tunnel Ventilation Damper with fire rating of 250°C for 2 Hrs', ''),
(86, 'E86', 'EOT Crane', ''),
(87, 'E87', 'High Mast and Street Light Pole', ''),
(88, 'E88', 'Cooling Tower', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `electricals_material_old`
--
ALTER TABLE `electricals_material_old`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `s_no` (`s_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `electricals_material_old`
--
ALTER TABLE `electricals_material_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
