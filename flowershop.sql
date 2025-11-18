-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2025 at 03:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flowershop`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `AdminID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Role` enum('superadmin','editor','viewer') DEFAULT 'editor',
  `Permissions` text DEFAULT NULL,
  `LastLogin` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`AdminID`, `UserID`, `Role`, `Permissions`, `LastLogin`) VALUES
(1, 1, 'superadmin', 'all', '2025-11-08 11:33:26');

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `AuthorID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`AuthorID`, `Name`, `Bio`) VALUES
(1, 'Nguyễn Lan', 'Chuyên viết bài về hoa tươi và nghệ thuật cắm hoa.'),
(2, 'Trần Bảo', 'Phóng viên chuyên mục thiên nhiên và văn hóa Việt.');

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add author', 7, 'add_author'),
(26, 'Can change author', 7, 'change_author'),
(27, 'Can delete author', 7, 'delete_author'),
(28, 'Can view author', 7, 'view_author'),
(29, 'Can add contact', 8, 'add_contact'),
(30, 'Can change contact', 8, 'change_contact'),
(31, 'Can delete contact', 8, 'delete_contact'),
(32, 'Can view contact', 8, 'view_contact'),
(33, 'Can add news', 9, 'add_news'),
(34, 'Can change news', 9, 'change_news'),
(35, 'Can delete news', 9, 'delete_news'),
(36, 'Can view news', 9, 'view_news'),
(37, 'Can add review', 10, 'add_review'),
(38, 'Can change review', 10, 'change_review'),
(39, 'Can delete review', 10, 'delete_review'),
(40, 'Can view review', 10, 'view_review'),
(41, 'Can add tag', 11, 'add_tag'),
(42, 'Can change tag', 11, 'change_tag'),
(43, 'Can delete tag', 11, 'delete_tag'),
(44, 'Can view tag', 11, 'view_tag'),
(45, 'Can add product', 12, 'add_product'),
(46, 'Can change product', 12, 'change_product'),
(47, 'Can delete product', 12, 'delete_product'),
(48, 'Can view product', 12, 'view_product'),
(49, 'Can add product media', 13, 'add_productmedia'),
(50, 'Can change product media', 13, 'change_productmedia'),
(51, 'Can delete product media', 13, 'delete_productmedia'),
(52, 'Can view product media', 13, 'view_productmedia'),
(53, 'Can add product tag', 14, 'add_producttag'),
(54, 'Can change product tag', 14, 'change_producttag'),
(55, 'Can delete product tag', 14, 'delete_producttag'),
(56, 'Can view product tag', 14, 'view_producttag');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$600000$SACU0arijHUkKYBzNjEtME$NVq3QwdvxEZ+KK/rt0pNz4Nk+8elg9PQ7kkJIOl6qmM=', NULL, 1, 'admin', '', '', '', 1, 1, '2025-10-29 10:42:58.513731');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `ContactID` int(11) NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `InterestedProduct` varchar(255) DEFAULT NULL,
  `Message` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `Status` enum('new','read','replied') DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`ContactID`, `FirstName`, `LastName`, `Phone`, `InterestedProduct`, `Message`, `CreatedAt`, `Status`) VALUES
(1, 'Mai', 'Linh', '0905123456', 'Sen Thái', 'Tôi muốn đặt hoa cho lễ cúng ngày mai.', '2025-10-29 17:08:37', 'new'),
(2, 'Tuấn', 'Anh', '0918123456', 'Sen Hồng', 'Hoa có giao buổi sáng được không?', '2025-10-29 17:08:37', 'new'),
(4, 'dddddd', 'dddd', '0357595504', 'dd', '333333', '2025-11-02 04:08:32', 'new'),
(5, 'Hoàng', 'dddd', '0357595504', 'dd', 'dddddwdc', '2025-11-03 03:08:00', 'new'),
(6, 'dkodkddo', 'kdkdd', '0357595504', 'dddddd', 'dddd', '2025-11-11 13:02:55', 'new');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(7, 'api', 'author'),
(8, 'api', 'contact'),
(9, 'api', 'news'),
(12, 'api', 'product'),
(13, 'api', 'productmedia'),
(14, 'api', 'producttag'),
(10, 'api', 'review'),
(11, 'api', 'tag'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-10-29 10:27:30.377490'),
(2, 'auth', '0001_initial', '2025-10-29 10:27:30.787825'),
(3, 'admin', '0001_initial', '2025-10-29 10:27:30.899593'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-10-29 10:27:30.907672'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-10-29 10:27:30.919077'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-10-29 10:27:30.976708'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-10-29 10:27:31.024529'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-10-29 10:27:31.040814'),
(9, 'auth', '0004_alter_user_username_opts', '2025-10-29 10:27:31.048938'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-10-29 10:27:31.096206'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-10-29 10:27:31.099339'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-10-29 10:27:31.108913'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-10-29 10:27:31.128537'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-10-29 10:27:31.142004'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-10-29 10:27:31.156184'),
(16, 'auth', '0011_update_proxy_permissions', '2025-10-29 10:27:31.163862'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-10-29 10:27:31.176576'),
(18, 'sessions', '0001_initial', '2025-10-29 10:27:31.207604'),
(20, 'api', '0001_initial', '2025-10-30 03:34:49.319413');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `NewsID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Slug` varchar(255) DEFAULT NULL,
  `Content` longtext DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `AuthorID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `ViewCount` int(11) DEFAULT 0,
  `ReadingTime` varchar(50) DEFAULT NULL,
  `Tags` varchar(255) DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`NewsID`, `Title`, `Slug`, `Content`, `Image`, `Category`, `AuthorID`, `CreatedAt`, `ViewCount`, `ReadingTime`, `Tags`, `CategoryID`) VALUES
(1, 'Bí quyết chọn hoa sen tươi lâu', 'bi-quyet-chon-hoa-sen-tuoi-lau', 'Hoa sen không chỉ mang vẻ đẹp thanh khiết mà còn tượng trưng cho sự thuần khiết và may mắn. Tuy nhiên, để giữ cho hoa sen tươi lâu sau khi mua về, bạn cần biết một số mẹo nhỏ nhưng vô cùng hiệu quả.\r\n\r\nChọn hoa sen tươi ngay từ đầu\r\nNên chọn những bông hoa có cánh ngoài còn khép, màu sắc tươi sáng, không bị dập nát. Cuống hoa phải còn xanh và cứng, khi bóp nhẹ có cảm giác chắc tay.\r\n\r\nBảo quản cuống hoa đúng cách\r\nSau khi mua về, bạn nên cắt chéo phần cuống hoa khoảng 2–3 cm và ngâm vào nước sạch có nhiệt độ phòng. Có thể thêm vài giọt nước rửa chén hoặc một ít muối để hạn chế vi khuẩn phát triển trong nước.\r\n\r\nThay nước mỗi ngày\r\nHoa sen rất “nhạy cảm” với nước bẩn. Hãy thay nước mỗi ngày và rửa sạch bình trước khi cho nước mới. Khi thay nước, đừng quên cắt lại phần cuống để hoa hút nước tốt hơn.\r\n\r\nTránh để hoa ở nơi nắng gắt\r\nKhông nên đặt bình hoa ở gần cửa sổ hoặc nơi có ánh nắng trực tiếp chiếu vào, vì nhiệt độ cao sẽ khiến cánh hoa nhanh héo. Nhiệt độ lý tưởng để hoa sen tươi lâu là khoảng 20–25°C.\r\n\r\nMẹo nhỏ từ dân cắm hoa\r\nNhiều người chơi hoa lâu năm chia sẻ: có thể cho vào bình một viên aspirin hoặc vài giọt nước cốt chanh. Những chất này giúp diệt khuẩn và kéo dài thời gian tươi của hoa.\r\n\r\nChỉ cần một chút tinh tế và cẩn thận, bạn có thể giữ cho bình hoa sen của mình luôn tươi tắn, tỏa hương nhẹ nhàng trong suốt nhiều ngày liền.', 'public\\baiviet1.jpg', 'Mẹo vặt', 1, '2025-10-29 17:08:37', 0, NULL, '#hoa #sen #camhoa', 2),
(2, 'Ý nghĩa của hoa sen trong đời sống', 'y-nghia-hoa-sen', 'Hoa sen là biểu tượng thiêng liêng trong văn hóa Á Đông, đặc biệt ở Việt Nam – nơi sen được xem là quốc hoa. Không chỉ là loài hoa đẹp, sen còn chứa đựng nhiều giá trị tinh thần, đạo đức và nhân sinh quan sâu sắc.\r\n\r\nBiểu tượng của sự thuần khiết và tái sinh\r\nSen mọc lên từ bùn nhưng vẫn vươn cao và nở ra những cánh hoa thanh khiết. Hình ảnh này tượng trưng cho con người vượt lên nghịch cảnh, giữ tâm hồn trong sáng dù sống trong môi trường không hoàn hảo.\r\n\r\nHoa sen trong Phật giáo\r\nTrong đạo Phật, hoa sen là biểu tượng của giác ngộ và trí tuệ. Đức Phật thường được mô tả ngồi trên tòa sen, thể hiện sự thanh tịnh tuyệt đối và giải thoát khỏi mọi ràng buộc trần tục.\r\n\r\nHoa sen trong văn hóa Việt\r\nHình ảnh hoa sen xuất hiện trong thơ ca, kiến trúc và đời sống người Việt từ lâu đời. Từ “sen hồng Đồng Tháp” cho đến những ao sen làng quê, loài hoa này gắn liền với sự giản dị, chân thành và lòng hiếu khách.\r\n\r\nÝ nghĩa phong thủy\r\nTrong phong thủy, sen được cho là mang lại năng lượng tích cực, giúp xua tan tà khí và đem lại bình an, may mắn cho gia chủ. Đặt một bình hoa sen trong nhà cũng được xem là cách giúp tâm trí thư thái, giảm căng thẳng.\r\n\r\nHoa sen trong nghệ thuật và đời sống hiện đại\r\nNgày nay, hoa sen không chỉ xuất hiện trong các công trình tôn giáo mà còn được ứng dụng trong thời trang, mỹ thuật, thậm chí là ẩm thực. Từ trà sen, mứt sen đến tinh dầu sen – tất cả đều mang hơi thở thanh nhã và tinh tế.\r\n\r\nHoa sen – giản dị mà thanh cao – chính là lời nhắc nhở con người hướng đến những giá trị tốt đẹp, sống chậm lại để cảm nhận sự an nhiên giữa cuộc đời đầy biến động.', 'public\\sendongthap2.jpg', 'Văn hóa', 2, '2025-10-29 17:08:37', 0, NULL, '#hoasen #dongthap', 3),
(12, 'sdddd', 'sdddd', 'ssssssssssss', 'news/sendongthap2.jpg', 'Tin tức', NULL, '2025-11-10 13:36:56', 0, NULL, '', NULL),
(13, 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffff', 'news/sentrang_qbFI3qL.jpg', 'Văn hóa', NULL, '2025-11-10 13:39:41', 0, NULL, '', NULL),
(15, 'jdfui', 'jdfui', 'ddddd', 'news/a49f53cfceafca0c3300fd7179bca695 - Copy.jpg', 'Tin tức', NULL, '2025-11-11 11:40:51', 0, NULL, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `news_categories`
--

CREATE TABLE `news_categories` (
  `CategoryID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_categories`
--

INSERT INTO `news_categories` (`CategoryID`, `Name`, `Description`) VALUES
(1, 'Mùa vụ', 'Tin tức về mùa vụ và thu hoạch hoa sen'),
(2, 'Hướng dẫn', 'Hướng dẫn chăm sóc, bảo quản và trồng sen'),
(3, 'Văn hóa', 'Ý nghĩa văn hóa và biểu tượng của hoa sen'),
(4, 'Kiến thức', 'Kiến thức về các giống sen và đặc sản'),
(5, 'Nhiếp ảnh', 'Kỹ thuật chụp ảnh hoa sen đẹp'),
(6, 'Du lịch', 'Địa điểm ngắm sen và du lịch liên quan'),
(7, 'Sức khỏe', 'Lợi ích sức khỏe từ hạt sen và các bộ phận'),
(8, 'Ẩm thực', 'Món ăn ngon từ sen và đặc sản ba miền'),
(9, 'Lịch sử', 'Lịch sử và nguồn gốc hoa sen tại Việt Nam');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `CustomerName` varchar(100) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `OrderDate` datetime DEFAULT current_timestamp(),
  `Status` enum('pending','confirmed','shipping','completed','cancelled') DEFAULT 'pending',
  `CustomerAddress` varchar(255) DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT 0.00,
  `Unit` varchar(50) DEFAULT 'bó',
  `Note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `CustomerName`, `Phone`, `Email`, `ProductID`, `Quantity`, `OrderDate`, `Status`, `CustomerAddress`, `TotalAmount`, `Unit`, `Note`) VALUES
(1, 'Khách hàng', '0822774784', 'example@gmail.com', 9, 1, '2025-11-02 12:27:52', 'pending', NULL, 0.00, 'bó', NULL),
(3, 'Khách hàng', '0822774784', 'example@gmail.com', 9, 1, '2025-11-10 03:00:40', 'pending', NULL, 0.00, 'bó', NULL),
(5, 'Ngô Thị Bắp', '0946791515', 'tho@gmail.com', 24, 2, '2025-11-10 11:20:03', 'pending', NULL, 0.00, 'bó', NULL),
(6, 'Ngô Hoàng', '0946791515', 'linh@gmail.com', 89, 1, '2025-11-17 08:34:55', 'pending', NULL, 0.00, 'bó', NULL),
(7, 'Ngô Hoànggggggggggggggggggggg', '0946791515', 'linh@gmail.com', 90, 1, '2025-11-17 09:02:28', 'pending', NULL, 0.00, 'bó', NULL),
(8, 'gggggggggghjfgggggggggghjf', '0946791515', 'linh@gmail.com', 24, 1, '2025-11-17 09:09:43', 'pending', NULL, 0.00, 'bó', NULL),
(9, 'ggggggghjf32ggggggghjf32', '0946791515', 'linh@gmail.com', 24, 1, '2025-11-17 09:26:06', 'completed', NULL, 29000.00, 'bó', NULL),
(10, 'lê thị', '0946791515', 'linh@gmail.com', 14, 1, '2025-11-17 09:38:49', 'pending', NULL, 320000.00, 'bó', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_schedules`
--

CREATE TABLE `order_schedules` (
  `ScheduleID` int(11) NOT NULL,
  `OrderID` int(11) NOT NULL,
  `ScheduledDate` date NOT NULL,
  `ScheduledTime` time DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'pending',
  `Note` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_schedules`
--

INSERT INTO `order_schedules` (`ScheduleID`, `OrderID`, `ScheduledDate`, `ScheduledTime`, `Status`, `Note`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, '2025-11-03', '08:30:00', 'pending', 'Giao buổi sáng sớm', '2025-11-17 13:47:40', '2025-11-17 13:47:40'),
(2, 3, '2025-11-11', '14:00:00', 'confirmed', 'Khách yêu cầu gọi trước', '2025-11-17 13:47:40', '2025-11-17 13:47:40'),
(3, 5, '2025-11-12', '10:00:00', 'pending', 'Giao trong giờ hành chính', '2025-11-17 13:47:40', '2025-11-17 13:47:40'),
(4, 3, '2025-11-21', '15:12:00', 'pending', 'đ', '2025-11-17 07:13:33', '2025-11-17 07:13:33'),
(5, 3, '2025-11-21', '16:15:00', 'pending', 'eeee', '2025-11-17 07:13:52', '2025-11-17 07:34:42'),
(6, 5, '2025-11-21', '17:24:00', 'pending', NULL, '2025-11-17 07:22:33', '2025-11-17 07:22:33'),
(7, 3, '2025-11-21', '17:24:00', 'confirmed', 'ddddd', '2025-11-17 07:27:04', '2025-11-17 09:26:36'),
(8, 3, '2025-11-21', '14:29:00', 'pending', 'fff', '2025-11-17 07:27:56', '2025-11-17 07:34:33');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Slug` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Origin` varchar(100) DEFAULT NULL,
  `FreshDuration` varchar(50) DEFAULT NULL,
  `IsFeatured` tinyint(1) DEFAULT 0,
  `Status` enum('Còn hàng','Hết hàng') DEFAULT 'Còn hàng',
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `CategoryID` int(11) DEFAULT NULL,
  `Media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Chứa danh sách ảnh/video cho sản phẩm' CHECK (json_valid(`Media`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `Name`, `Slug`, `Description`, `Price`, `Origin`, `FreshDuration`, `IsFeatured`, `Status`, `CreatedAt`, `CategoryID`, `Media`) VALUES
(9, 'Sen Đồng Tháp', 'sen-dong-thap', 'Hoa sen đặc sản từ vùng Đồng Tháp Mười, cánh hồng dày và hương thơm dịu nhẹ. Thích hợp cho cúng lễ và trang trí.', 180000.00, 'Đồng Tháp', '3 ngày', 1, 'Còn hàng', '2025-10-31 16:05:09', 1, NULL),
(14, 'hoa lá hẹ', 'hoa-la-he', 'dddddddddddddddddddddddddddd', 320000.00, 'Việt Nam', '5-7 ngày', 0, 'Còn hàng', '2025-11-10 03:59:13', NULL, NULL),
(24, 'sen đồng tháp', 'sen-ong-thap', 'dddddddddddddddddd', 29000.00, 'Việt Nam', '5-7 ngày', 0, 'Còn hàng', '2025-11-10 11:16:47', NULL, NULL),
(89, 'sen chùa', 'sen-chua', NULL, 0.00, 'Việt Nam', '5-7 ngày', 0, 'Còn hàng', '2025-11-11 11:08:05', NULL, '[{\"type\": \"image\", \"url\": \"/media/products/media/sencungchua.jpg\"}, {\"type\": \"video\", \"url\": \"/media/products/media/videosendongthap_f3SwFne.mp4\"}]'),
(90, 'djdddod', 'djdddod', NULL, 8000.00, 'trung quốc', '5-8 ngày', 0, 'Còn hàng', '2025-11-11 11:42:18', NULL, '[{\"type\": \"image\", \"url\": \"/media/products/media/a49f53cfceafca0c3300fd7179bca695%20-%20Copy_qoEAbSs.jpg\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `CategoryID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`CategoryID`, `Name`, `Description`) VALUES
(1, 'Sen Đồng Tháp', 'Hoa sen từ vùng Đồng Tháp Mười, tươi lâu và thơm tự nhiên'),
(2, 'Sen Thái', 'Giống sen nhập khẩu từ Thái Lan, cánh to và màu sắc rực rỡ'),
(3, 'Sen Việt', 'Hoa sen truyền thống Việt Nam, giá cả phải chăng'),
(4, 'Sen Xanh Ngọc', 'Hoa sen màu xanh đặc biệt, hiếm có'),
(5, 'Bó Sen Nghệ Thuật', 'Bó hoa sen được thiết kế nghệ thuật cho sự kiện'),
(6, 'wwwwwwwwwwww', '');

-- --------------------------------------------------------

--
-- Table structure for table `product_tags`
--

CREATE TABLE `product_tags` (
  `id` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `TagID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_tags`
--

INSERT INTO `product_tags` (`id`, `ProductID`, `TagID`) VALUES
(17, 9, 7),
(18, 9, 8);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `ReviewID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL CHECK (`Rating` between 1 and 5),
  `Comment` text DEFAULT NULL,
  `Purchased` tinyint(1) DEFAULT 0,
  `Attachments` varchar(255) DEFAULT NULL,
  `ReviewDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`ReviewID`, `ProductID`, `CustomerName`, `Rating`, `Comment`, `Purchased`, `Attachments`, `ReviewDate`) VALUES
(4, 9, 'Mai Linh', 5, 'Hoa sen Đồng Tháp rất tươi, hương thơm dịu nhẹ. Giao hàng nhanh, đóng gói cẩn thận!', 1, '/uploads/reviews/sen-dong-thap-1.jpg', '2025-10-30 09:15:00'),
(17, 24, 'fjifjnvlb', 3, 'ddd', 1, '[{}]', '2025-11-10 11:40:03'),
(19, 90, 'đjddid', 5, 'ssssdd', 1, '[]', '2025-11-11 11:43:02');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `TagID` int(11) NOT NULL,
  `TagName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`TagID`, `TagName`) VALUES
(9, 'Hoa cao cấp'),
(5, 'Hoa cúng lễ'),
(7, 'Hoa đặc sản'),
(6, 'Hoa nghệ thuật'),
(8, 'Hoa tươi lâu');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `TransactionID` int(11) NOT NULL,
  `Type` varchar(10) NOT NULL,
  `Category` varchar(100) NOT NULL,
  `Amount` decimal(15,0) NOT NULL,
  `Description` text DEFAULT NULL,
  `TransactionDate` date DEFAULT curdate(),
  `OrderID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`TransactionID`, `Type`, `Category`, `Amount`, `Description`, `TransactionDate`, `OrderID`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'income', 'Thanh toán đơn hàng', 180000, 'Khách thanh toán đơn hàng #1', '2025-11-03', 1, '2025-11-17 13:47:40', '2025-11-17 13:47:40'),
(2, 'income', 'Thanh toán đơn hàng', 180000, 'Khách thanh toán đơn hàng #3', '2025-11-19', 3, '2025-11-17 13:47:40', '2025-11-17 09:55:23'),
(4, 'expense', 'Nhập hàng', 450000, 'Nhập hoa sen từ Đồng Tháp', '2025-11-01', NULL, '2025-11-17 13:47:40', '2025-11-17 13:47:40'),
(5, 'expense', 'Chi phí vận chuyển', 90000, 'Chi phí giao hàng tháng 11', '2025-11-05', NULL, '2025-11-17 13:47:40', '2025-11-17 13:47:40'),
(6, 'expense', 'Phòng trọ', 10000, 'yyyy', '2025-11-04', 3, '2025-11-17 09:27:05', '2025-11-17 09:27:05'),
(7, 'income', 'Phòng trọ', 10000, '', '2025-11-04', 3, '2025-11-17 09:43:05', '2025-11-17 09:43:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`AdminID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`AuthorID`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`ContactID`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`NewsID`),
  ADD UNIQUE KEY `Slug` (`Slug`),
  ADD KEY `AuthorID` (`AuthorID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `news_categories`
--
ALTER TABLE `news_categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `order_schedules`
--
ALTER TABLE `order_schedules`
  ADD PRIMARY KEY (`ScheduleID`),
  ADD KEY `idx_status_date` (`Status`,`ScheduledDate`),
  ADD KEY `idx_schedule_date` (`ScheduledDate`),
  ADD KEY `fk_schedule_order` (`OrderID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD UNIQUE KEY `Slug` (`Slug`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product_tag` (`ProductID`,`TagID`),
  ADD KEY `idx_product` (`ProductID`),
  ADD KEY `idx_tag` (`TagID`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`ReviewID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`TagID`),
  ADD UNIQUE KEY `TagName` (`TagName`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `idx_type_date` (`Type`,`TransactionDate`),
  ADD KEY `idx_transaction_date` (`TransactionDate`),
  ADD KEY `fk_transaction_order` (`OrderID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `AdminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `AuthorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `ContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `NewsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `news_categories`
--
ALTER TABLE `news_categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_schedules`
--
ALTER TABLE `order_schedules`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_tags`
--
ALTER TABLE `product_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `TagID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`AuthorID`) REFERENCES `authors` (`AuthorID`) ON DELETE SET NULL,
  ADD CONSTRAINT `news_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `news_categories` (`CategoryID`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE;

--
-- Constraints for table `order_schedules`
--
ALTER TABLE `order_schedules`
  ADD CONSTRAINT `fk_schedule_order` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `product_categories` (`CategoryID`) ON DELETE SET NULL;

--
-- Constraints for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD CONSTRAINT `fk_product_tag_product` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_tag_tag` FOREIGN KEY (`TagID`) REFERENCES `tags` (`TagID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transaction_order` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
