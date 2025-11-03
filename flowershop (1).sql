-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2025 at 04:25 AM
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
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`ContactID`, `FirstName`, `LastName`, `Phone`, `InterestedProduct`, `Message`, `CreatedAt`) VALUES
(1, 'Mai', 'Linh', '0905123456', 'Sen Thái', 'Tôi muốn đặt hoa cho lễ cúng ngày mai.', '2025-10-29 17:08:37'),
(2, 'Tuấn', 'Anh', '0918123456', 'Sen Hồng', 'Hoa có giao buổi sáng được không?', '2025-10-29 17:08:37'),
(3, 'string', 'string', 'string', 'string', 'string', '2025-10-29 12:32:58'),
(4, 'dddddd', 'dddd', '0357595504', 'dd', '333333', '2025-11-02 04:08:32'),
(5, 'Hoàng', 'dddd', '0357595504', 'dd', 'dddddwdc', '2025-11-03 03:08:00');

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
  `Tags` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`NewsID`, `Title`, `Slug`, `Content`, `Image`, `Category`, `AuthorID`, `CreatedAt`, `ViewCount`, `ReadingTime`, `Tags`) VALUES
(1, 'Bí quyết chọn hoa sen tươi lâu', 'bi-quyet-chon-hoa-sen-tuoi-lau', 'Hoa sen không chỉ mang vẻ đẹp thanh khiết mà còn tượng trưng cho sự thuần khiết và may mắn. Tuy nhiên, để giữ cho hoa sen tươi lâu sau khi mua về, bạn cần biết một số mẹo nhỏ nhưng vô cùng hiệu quả.\r\n\r\nChọn hoa sen tươi ngay từ đầu\r\nNên chọn những bông hoa có cánh ngoài còn khép, màu sắc tươi sáng, không bị dập nát. Cuống hoa phải còn xanh và cứng, khi bóp nhẹ có cảm giác chắc tay.\r\n\r\nBảo quản cuống hoa đúng cách\r\nSau khi mua về, bạn nên cắt chéo phần cuống hoa khoảng 2–3 cm và ngâm vào nước sạch có nhiệt độ phòng. Có thể thêm vài giọt nước rửa chén hoặc một ít muối để hạn chế vi khuẩn phát triển trong nước.\r\n\r\nThay nước mỗi ngày\r\nHoa sen rất “nhạy cảm” với nước bẩn. Hãy thay nước mỗi ngày và rửa sạch bình trước khi cho nước mới. Khi thay nước, đừng quên cắt lại phần cuống để hoa hút nước tốt hơn.\r\n\r\nTránh để hoa ở nơi nắng gắt\r\nKhông nên đặt bình hoa ở gần cửa sổ hoặc nơi có ánh nắng trực tiếp chiếu vào, vì nhiệt độ cao sẽ khiến cánh hoa nhanh héo. Nhiệt độ lý tưởng để hoa sen tươi lâu là khoảng 20–25°C.\r\n\r\nMẹo nhỏ từ dân cắm hoa\r\nNhiều người chơi hoa lâu năm chia sẻ: có thể cho vào bình một viên aspirin hoặc vài giọt nước cốt chanh. Những chất này giúp diệt khuẩn và kéo dài thời gian tươi của hoa.\r\n\r\nChỉ cần một chút tinh tế và cẩn thận, bạn có thể giữ cho bình hoa sen của mình luôn tươi tắn, tỏa hương nhẹ nhàng trong suốt nhiều ngày liền.', 'public\\baiviet1.jpg', 'Mẹo vặt', 1, '2025-10-29 17:08:37', 0, NULL, '#hoa #sen #camhoa'),
(2, 'Ý nghĩa của hoa sen trong đời sống', 'y-nghia-hoa-sen', 'Hoa sen là biểu tượng thiêng liêng trong văn hóa Á Đông, đặc biệt ở Việt Nam – nơi sen được xem là quốc hoa. Không chỉ là loài hoa đẹp, sen còn chứa đựng nhiều giá trị tinh thần, đạo đức và nhân sinh quan sâu sắc.\r\n\r\nBiểu tượng của sự thuần khiết và tái sinh\r\nSen mọc lên từ bùn nhưng vẫn vươn cao và nở ra những cánh hoa thanh khiết. Hình ảnh này tượng trưng cho con người vượt lên nghịch cảnh, giữ tâm hồn trong sáng dù sống trong môi trường không hoàn hảo.\r\n\r\nHoa sen trong Phật giáo\r\nTrong đạo Phật, hoa sen là biểu tượng của giác ngộ và trí tuệ. Đức Phật thường được mô tả ngồi trên tòa sen, thể hiện sự thanh tịnh tuyệt đối và giải thoát khỏi mọi ràng buộc trần tục.\r\n\r\nHoa sen trong văn hóa Việt\r\nHình ảnh hoa sen xuất hiện trong thơ ca, kiến trúc và đời sống người Việt từ lâu đời. Từ “sen hồng Đồng Tháp” cho đến những ao sen làng quê, loài hoa này gắn liền với sự giản dị, chân thành và lòng hiếu khách.\r\n\r\nÝ nghĩa phong thủy\r\nTrong phong thủy, sen được cho là mang lại năng lượng tích cực, giúp xua tan tà khí và đem lại bình an, may mắn cho gia chủ. Đặt một bình hoa sen trong nhà cũng được xem là cách giúp tâm trí thư thái, giảm căng thẳng.\r\n\r\nHoa sen trong nghệ thuật và đời sống hiện đại\r\nNgày nay, hoa sen không chỉ xuất hiện trong các công trình tôn giáo mà còn được ứng dụng trong thời trang, mỹ thuật, thậm chí là ẩm thực. Từ trà sen, mứt sen đến tinh dầu sen – tất cả đều mang hơi thở thanh nhã và tinh tế.\r\n\r\nHoa sen – giản dị mà thanh cao – chính là lời nhắc nhở con người hướng đến những giá trị tốt đẹp, sống chậm lại để cảm nhận sự an nhiên giữa cuộc đời đầy biến động.', 'public\\sendongthap2.jpg', 'Văn hóa', 2, '2025-10-29 17:08:37', 0, NULL, '#hoasen #dongthap');

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
  `OrderDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `CustomerName`, `Phone`, `Email`, `ProductID`, `Quantity`, `OrderDate`) VALUES
(1, 'Khách hàng', '0822774784', 'example@gmail.com', 9, 1, '2025-11-02 12:27:52');

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
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `Name`, `Slug`, `Description`, `Price`, `Origin`, `FreshDuration`, `IsFeatured`, `Status`, `CreatedAt`) VALUES
(9, 'Sen Đồng Tháp', 'sen-dong-thap', 'Hoa sen đặc sản từ vùng Đồng Tháp Mười, cánh hồng dày và hương thơm dịu nhẹ. Thích hợp cho cúng lễ và trang trí.', 180000.00, 'Đồng Tháp', '3 ngày', 1, 'Còn hàng', '2025-10-31 16:05:09'),
(10, 'Sen Hồng Cúng Chùa', 'sen-hong-cung-chua', 'Sen hồng tươi lâu, biểu tượng của sự thành kính và bình an. Thường được chọn trong các dịp lễ chùa, rằm, Vu Lan.', 120000.00, 'An Giang', '2 ngày', 0, 'Còn hàng', '2025-10-31 16:05:09'),
(11, 'Sen Trắng Tinh Khiết', 'sen-trang-tinh-khiet', 'Hoa sen trắng mang ý nghĩa thanh cao, tinh khiết. Phù hợp làm quà biếu hoặc trang trí không gian thiền.', 150000.00, 'Bến Tre', '4 ngày', 1, 'Còn hàng', '2025-10-31 16:05:09'),
(12, 'Sen Xanh Ngọc Quý Hiếm', 'sen-xanh-ngoc-quy-hiem', 'Giống sen độc đáo có màu xanh ngọc nhẹ, được trồng trong điều kiện đặc biệt. Hoa nở to, giữ hương lâu.', 250000.00, 'Huế', '5 ngày', 1, 'Còn hàng', '2025-10-31 16:05:09'),
(13, 'Bó Sen Nghệ Thuật', 'bo-sen-nghe-thuat', 'Bó hoa sen được phối kết nghệ thuật với lá và cánh sen sấy khô. Thích hợp làm quà tặng hoặc trang trí sự kiện.', 190000.00, 'TP. Hồ Chí Minh', 'Không giới hạn', 0, 'Còn hàng', '2025-10-31 16:05:09');

-- --------------------------------------------------------

--
-- Table structure for table `product_media`
--

CREATE TABLE `product_media` (
  `MediaID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `MediaType` enum('image','video') DEFAULT 'image',
  `Url` varchar(255) DEFAULT NULL,
  `IsPrimary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_media`
--

INSERT INTO `product_media` (`MediaID`, `ProductID`, `MediaType`, `Url`, `IsPrimary`) VALUES
(5, 9, 'image', 'public\\sendongthap.jpg', 1),
(6, 9, 'video', 'public\\videosendongthap.mp4', 0),
(7, 10, 'image', 'public\\sencungchua.jpg', 1),
(8, 10, 'video', '/media/products/sen-hong-cung-chua.mp4', 0),
(9, 11, 'image', 'public\\sentrang.jpg', 1),
(10, 12, 'image', 'public\\senxanhngoc.jpg', 1),
(11, 12, 'video', '/media/products/sen-xanh-ngoc.mp4', 0),
(12, 13, 'image', 'public\\bosen.jpg', 1);

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
(18, 9, 8),
(19, 10, 5),
(20, 10, 9),
(22, 11, 6),
(21, 11, 8),
(23, 12, 9),
(24, 13, 5),
(25, 13, 7);

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
(5, 10, 'Tuấn Anh', 4, 'Sen hồng tươi lâu, màu sắc đẹp. Tuy nhiên giao hơi trễ 15 phút.', 1, '/uploads/reviews/sen-hong-1.jpg', '2025-10-31 08:40:00'),
(6, 11, 'Minh Châu', 5, 'Sen trắng rất tinh khiết và sang trọng, thích hợp làm quà tặng. Sẽ ủng hộ thêm!', 1, '/uploads/reviews/sen-trang-1.jpg', '2025-11-01 10:20:00'),
(7, 12, 'Hải Đăng', 5, 'Sen xanh ngọc hiếm thấy, rất độc đáo. Mùi hương nhẹ và hoa nở to.', 1, '/uploads/reviews/sen-xanh-1.jpg', '2025-11-01 11:45:00'),
(8, 13, 'Thảo Vy', 4, 'Bó sen nghệ thuật được gói đẹp, nhưng lá hơi khô một chút.', 1, '/uploads/reviews/bo-sen-nghe-thuat-1.jpg', '2025-11-01 12:00:00'),
(9, 13, 'Khánh My', 5, 'Bó hoa được gói rất đẹp, màu sắc hài hòa và tinh tế. Nhận hàng đúng như hình!', 1, '/uploads/reviews/bo-sen-nghe-thuat-2.jpg', '2025-11-01 13:30:00'),
(10, 13, 'Phúc Lâm', 4, 'Hoa tươi và nghệ thuật, nhưng phần giấy gói hơi nhăn nhẹ.', 1, '/uploads/reviews/bo-sen-nghe-thuat-3.jpg', '2025-11-01 14:05:00'),
(11, 13, 'Tố Uyên', 5, 'Tôi mua tặng mẹ, mẹ rất thích. Hương sen thơm nhẹ nhàng và giữ lâu.', 1, '/uploads/reviews/bo-sen-nghe-thuat-4.jpg', '2025-11-01 15:10:00'),
(12, 10, 'Mai Hương', 5, 'Hoa rất đẹp và tươi, giao hàng nhanh!', 1, '/uploads/reviews/senhong1.jpg', '2025-11-01 09:15:00'),
(13, 10, 'Ngọc Trân', 4, 'Sen hồng rất đẹp, nhưng giao hơi chậm một chút.', 1, '/uploads/reviews/senhong2.jpg', '2025-11-01 10:45:00'),
(14, 10, 'Tấn Phát', 5, 'Chất lượng hoa tuyệt vời, đúng như quảng cáo.', 1, '/uploads/reviews/senhong3.jpg', '2025-11-01 12:00:00'),
(15, 13, 'ddddd', 5, 'ddd', 1, '[]', '2025-11-01 10:32:25');

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

--
-- Indexes for dumped tables
--

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
  ADD KEY `AuthorID` (`AuthorID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD UNIQUE KEY `Slug` (`Slug`);

--
-- Indexes for table `product_media`
--
ALTER TABLE `product_media`
  ADD PRIMARY KEY (`MediaID`),
  ADD KEY `ProductID` (`ProductID`);

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
-- AUTO_INCREMENT for dumped tables
--

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
  MODIFY `ContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `NewsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_media`
--
ALTER TABLE `product_media`
  MODIFY `MediaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_tags`
--
ALTER TABLE `product_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `TagID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

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
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`AuthorID`) REFERENCES `authors` (`AuthorID`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE;

--
-- Constraints for table `product_media`
--
ALTER TABLE `product_media`
  ADD CONSTRAINT `product_media_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
