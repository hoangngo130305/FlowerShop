"use client";

import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Chatbot from "../components/Chatbot";
import { SharedHeader } from "../components/SharedHeader";
import ContactSection from "../components/ContactSection";
import { SharedFooter } from "../components/SharedFooter";
import ProductDetailPage from "../components/ProductDetailPage";
import NewsDetailPage from "../components/NewsDetailPage";
import ProductsSection from "../components/ProductsSection"; // ← Chỉ import component
import NewsSection from "../components/NewsSection";
import HeroSection from "../components/HeroSection";
import { useIsMobile } from "../components/ui/use-mobile";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Flower } from "lucide-react";

function AppContent() {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  const [productImageIndex, setProductImageIndex] = useState(0);
  const [showAllNews, setShowAllNews] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    product: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const currentUserName = "Khách hàng";

  // News articles data
  const newsArticles = [
    {
      id: 1,
      title: "Mùa sen về trên đồng ruộng Đồng Tháp",
      excerpt:
        "Khám phá vẻ đẹp của mùa sen tại vùng đất Đồng Tháp Mười với những cánh đồng sen bạt ngàn trải dài đến tận chân trời",
      image:
        "https://images.unsplash.com/photo-1659532165024-29510c914b04?w=600&q=75",
      category: "Mùa vụ",
      date: "01/11/2025",
      author: "Nguyễn Văn Minh",
      readTime: "5 phút đọc",
      content: `Đồng Tháp Mười - vùng đất nổi tiếng với những cánh đồng sen bạt ngàn, là điểm đến không thể bỏ qua cho những ai yêu thích vẻ đẹp thuần khiết của hoa sen. Mỗi khi mùa sen về, từ tháng 5 đến tháng 9 hàng năm, cả một vùng trời đất rộng lớn như được khoác lên mình tấm áo mới rực rỡ sắc hồng, trắng thanh khiết.

Những cánh đồng sen ở đây không chỉ đẹp mà còn mang lại nguồn thu nhập ổn định cho người dân địa phương. Sen Đồng Tháp được đánh giá cao về chất lượng, hương thơm tự nhiên và độ tươi lâu. Đặc biệt, người dân nơi đây đã có hơn trăm năm kinh nghiệm trong việc chăm sóc và canh tác sen.

Vào buổi sáng sớm, khi ánh nắng đầu tiên rọi xuống mặt nước, những bông sen đang nở rộ khoe sắc càng thêm tươi thắm. Đây cũng là thời điểm lý tưởng nhất để hái sen, khi hoa vừa mới nở và giữ được độ tươi tốt nhất. Người dân thường phải thức dậy từ 4-5 giờ sáng để kịp thu hoạch những bông sen đẹp nhất.

Không chỉ là nguồn thu nhập, sen còn trở thành biểu tượng văn hóa của vùng đất này. Nhiều lễ hội, sự kiện văn hóa được tổ chức xoay quanh mùa sen, thu hút đông đảo du khách trong và ngoài nước đến tham quan, trải nghiệm.`,
      tags: ["sen", "đồng tháp", "mùa vụ", "du lịch"],
    },
    {
      id: 2,
      title: "Cách bảo quản hoa sen tươi lâu",
      excerpt:
        "Hướng dẫn chi tiết cách giữ hoa sen tươi đẹp trong nhiều ngày với những mẹo đơn giản mà hiệu quả",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=75",
      category: "Hướng dẫn",
      date: "28/10/2025",
      author: "Trần Thị Hồng",
      readTime: "4 phút đọc",
      content: `Hoa sen là loài hoa mang vẻ đẹp thanh cao, tinh khiết nhưng cũng rất dễ héo nếu không biết cách bảo quản đúng cách. Dưới đây là những mẹo giúp bạn giữ hoa sen tươi lâu hơn:

1. Chuẩn bị bình cắm và nước
Chọn bình cắm có miệng rộng để hoa sen được thoáng khí. Sử dụng nước sạch, có thể thêm một ít đường hoặc aspirin để giúp hoa tươi lâu hơn. Mực nước nên ngập khoảng 2/3 thân hoa.

2. Xử lý thân hoa
Cắt gọt lại phần đuôi thân hoa theo góc 45 độ, giúp hoa hút nước tốt hơn. Loại bỏ lá và nụ sen ở phần dưới thân để tránh thối rữa.

3. Vị trí đặt hoa
Đặt bình hoa ở nơi thoáng mát, tránh ánh nắng trực tiếp và gió lùa. Không đặt gần hoa quả chín vì chúng tạo ra khí ethylene làm hoa nhanh tàn.

4. Chăm sóc hàng ngày
Thay nước mỗi ngày hoặc ít nhất 2 ngày một lần. Mỗi lần thay nước nên cắt gọt lại đuôi thân một chút. Xịt sương nhẹ lên cánh hoa vào buổi sáng để giữ độ ẩm.

5. Mẹo thêm
Có thể thêm vài giọt nước Javel loãng để diệt khuẩn, giữ nước trong lâu hơn. Hoặc sử dụng các chất bảo quản hoa chuyên dụng có bán tại các cửa hàng hoa.

Với những mẹo đơn giản trên, bạn có thể giữ hoa sen tươi đẹp từ 5-7 ngày, thậm chí lâu hơn.`,
      tags: ["bảo quản", "hướng dẫn", "chăm sóc hoa"],
    },
    {
      id: 3,
      title: "Ý nghĩa của hoa sen trong văn hóa Việt Nam",
      excerpt:
        "Tìm hiểu về biểu tượng văn hóa đặc sắc và ý nghĩa sâu sắc của hoa sen đối với người Việt qua các thời kỳ lịch sử",
      image:
        "https://images.unsplash.com/photo-1749117631945-cbb1ff99c03d?w=600&q=75",
      category: "Văn hóa",
      date: "25/10/2025",
      author: "Lê Văn Thành",
      readTime: "6 phút đọc",
      content: `Hoa sen từ lâu đã trở thành biểu tượng văn hóa đặc sắc của dân tộc Việt Nam. Không chỉ đơn thuần là một loài hoa đẹp, sen còn mang trong mình những giá trị tinh thần sâu sắc, gắn liền với tâm thức và đời sống của người Việt.

Sen - Biểu tượng của sự thanh cao
Trong tư tưởng Phật giáo, hoa sen tượng trưng cho sự thanh tịnh, giải thoát khỏi trần tục. Hoa sen mọc từ bùn lầy nhưng vẫn giữ được vẻ đẹp trong trắng, không nhiễm bụi trần, chính là hình ảnh của những con người tu tập, sống trong đời nhưng không vướng bận phiền não.

Sen trong nghệ thuật dân gian
Hình ảnh hoa sen xuất hiện khắp nơi trong nghệ thuật Việt Nam: từ tranh dân gian Đông Hồ, gốm sứ Bát Tràng, đến các công trình kiến trúc đình chùa. Mỗi nét vẽ, mỗi hoa văn sen đều thể hiện tình yêu và sự trân trọng của người Việt với loài hoa này.

Sen trong ẩm thực
Không chỉ là hoa cảnh, sen còn là nguyên liệu quý trong ẩm thực Việt. Từ hạt sen, củ sen, lá sen đến nhị sen đều có thể chế biến thành những món ăn bổ dưỡng và thức uống thanh mát. Chè hạt sen, củ sen xào, gà hấp lá sen... là những món ăn truyền thống không thể thiếu trong ẩm thực Việt.

Sen trong đời sống tinh thần
Người Việt thường dùng hoa sen để cúng Phật, thờ cúng tổ tiên, trang trí ban thờ. Trong các dịp lễ lớn, hoa sen tươi được ưu tiên lựa chọn vì sự thanh khiết và trang nghiêm của nó. Hương sen thoang thoảng tạo nên không gian an lành, thanh tịnh.

Cho đến ngày nay, hoa sen vẫn giữ vị trí đặc biệt trong lòng người Việt, là niềm tự hào về một biểu tượng văn hóa đẹp đẽ và ý nghĩa.`,
      tags: ["văn hóa", "ý nghĩa", "truyền thống", "phật giáo"],
    },
    {
      id: 4,
      title: "Top 5 giống sen đẹp nhất Việt Nam",
      excerpt:
        "Khám phá những giống sen quý hiếm và đẹp nhất được trồng phổ biến tại Việt Nam với đặc điểm riêng biệt của từng loại",
      image:
        "https://images.unsplash.com/photo-1759240096601-5e2cf23b42f4?w=600&q=75",
      category: "Kiến thức",
      date: "20/10/2025",
      author: "Phạm Thị Mai",
      readTime: "5 phút đọc",
      content: `Việt Nam có nhiều giống sen đẹp, mỗi giống mang một vẻ đẹp riêng biệt và được ưa chuộng ở từng vùng miền khác nhau. Dưới đây là top 5 giống sen đẹp nhất hiện nay:

1. Sen Tây Hồ
Được coi là giống sen quý nhất Việt Nam, sen Tây Hồ có bông to, màu hồng tươi, cánh hoa mềm mại và hương thơm dịu nhẹ đặc trưng. Giống sen này được trồng nhiều ở vùng Hồ Tây - Hà Nội và rất được ưa chuộng trong các dịp lễ hội.

2. Sen trắng Bách Diệp
Còn gọi là sen ngàn cánh, giống sen này có đặc điểm là số lượng cánh hoa rất nhiều, xếp chồng lên nhau tạo thành hình bông tròn đầy đặn. Màu trắng tinh khôi của sen Bách Diệp tượng trưng cho sự trong sáng, thanh khiết.

3. Sen Hàm Rồng
Đây là giống sen đặc sản của Thanh Hóa, có màu hồng đậm rất đẹp mắt. Hoa to, thơm mạnh và nở rộ vào buổi sáng sớm. Sen Hàm Rồng được trồng nhiều phục vụ cho mục đích cảnh và lễ hội.

4. Sen Trúc Chi
Giống sen này có nguồn gốc từ Trung Quốc nhưng đã được trồng phổ biến ở Việt Nam. Đặc điểm nổi bật là hoa có màu hồng phớt tím, cánh hoa dài và thanh mảnh, tạo cảm giác nhẹ nhàng, thanh thoát.

5. Sen Sapa
Là giống sen đặc sản của vùng cao Tây Bắc, sen Sapa có kích thước nhỏ hơn các giống khác nhưng lại có màu sắc rực rỡ và độ bền cao. Hoa có thể giữ được độ tươi lâu hơn nhờ khí hậu mát mẻ của vùng núi.

Mỗi giống sen đều có vẻ đẹp riêng, phù hợp với từng mục đích sử dụng và sở thích của mỗi người. Việc lựa chọn giống sen phụ thuộc vào điều kiện khí hậu, đất đai và nhu cầu sử dụng của bạn.`,
      tags: ["giống sen", "kiến thức", "đặc sản", "trồng sen"],
    },
    {
      id: 5,
      title: "Bí quyết chụp ảnh sen đẹp như chuyên nghiệp",
      excerpt:
        "Chia sẻ những kỹ thuật và góc máy đẹp nhất để có được những bức ảnh hoa sen ấn tượng và nghệ thuật",
      image:
        "https://images.unsplash.com/photo-1659532165024-29510c914b04?w=600&q=75",
      category: "Nhiếp ảnh",
      date: "15/10/2025",
      author: "Đỗ Minh Tuấn",
      readTime: "7 phút đọc",
      content: `Hoa sen với vẻ đẹp thanh thoát, tinh khiết luôn là đối tượng yêu thích của các nhiếp ảnh gia. Dưới đây là những bí quyết giúp bạn có được những bức ảnh sen đẹp như chuyên nghiệp:

Thời điểm chụp ảnh
Buổi sáng sớm từ 5-7 giờ là thời điểm lý tưởng nhất. Lúc này hoa sen mới nở, ánh sáng mềm mại tạo hiệu ứng đẹp mắt. Những giọt sương đọng trên cánh hoa sẽ làm tăng thêm vẻ đẹp lung linh cho bức ảnh.

Góc chụp và bố cục
- Góc thấp: Chụp từ dưới lên tạo cảm giác hoa sen cao quý, trang nghiêm
- Góc ngang: Làm nổi bật toàn bộ bông hoa, phù hợp chụp chi tiết
- Góc cao: Tạo góc nhìn tổng thể về đồng sen, thích hợp dùng flycam

Ánh sáng và phơi sáng
Sử dụng ánh sáng tự nhiên là tốt nhất. Ánh sáng sớm mai hoặc chiều tà tạo hiệu ứng màu sắc đẹp. Ngược sáng giúp làm nổi bật đường nét cánh hoa mỏng manh. Cần chú ý điều chỉnh phơi sáng để không bị cháy trắng cánh hoa.

Thiết lập máy ảnh
- Khẩu độ: f/2.8 - f/5.6 để làm mờ phông nền, nổi bật chủ thể
- ISO: Giữ thấp (100-400) để giảm nhiễu
- Tốc độ màn trập: Đủ nhanh để đóng băng chuyển động (1/250s trở lên nếu có gió)

Kỹ thuật đặc biệt
- Macro: Chụp chi tiết nhị hoa, giọt sương trên cánh sen
- Minimalist: Sử dụng không gian trống tạo sự tĩnh lặng, thanh thản
- Reflection: Chụp phản chiếu của hoa sen trên mặt nước

Hậu kỳ
Chỉnh sáng nhẹ, tăng độ tương phản vừa phải. Giữ màu sắc tự nhiên, tránh chỉnh quá đà làm mất đi vẻ đẹp thuần khiết của hoa sen. Có thể làm mờ phông nền thêm để tạo độ sâu cho ảnh.

Hãy kiên nhẫn và thử nghiệm nhiều góc độ, ánh sáng khác nhau để tìm ra phong cách riêng của mình. Mỗi bông sen đều có vẻ đẹp riêng biệt, nhiệm vụ của bạn là bắt trọn khoảnh khắc đó.`,
      tags: ["nhiếp ảnh", "kỹ thuật", "hướng dẫn", "nghệ thuật"],
    },
    {
      id: 6,
      title: "Những địa điểm ngắm sen đẹp nhất miền Bắc",
      excerpt:
        "Điểm danh các địa điểm nổi tiếng để ngắm sen tại miền Bắc Việt Nam, lý tưởng cho chuyến du lịch cuối tuần",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=75",
      category: "Du lịch",
      date: "10/10/2025",
      author: "Nguyễn Thu Hà",
      readTime: "5 phút đọc",
      content: `Miền Bắc Việt Nam có nhiều địa điểm trồng sen nổi tiếng, là điểm đến lý tưởng cho những ai muốn chiêm ngưỡng vẻ đẹp của loài hoa thanh khiết này. Dưới đây là những địa điểm không thể bỏ qua:

1. Hồ Tây - Hà Nội
Nổi tiếng với giống sen Tây Hồ quý hiếm, đây là địa điểm ngắm sen truyền thống nhất của Hà Nội. Vào mùa sen, bạn có thể thuê thuyền đạp vịt để đi sâu vào giữa đầm sen, tận hưởng không gian yên bình và hương thơm ngào ngạt.

2. Đầm sen Hồ Đông - Hà Nội
Nằm trong khuôn viên chùa Đức Hậu, đầm sen này rộng hơn 3 hecta với nhiều giống sen đẹp. Không gian thanh tịnh của chùa kết hợp với vẻ đẹp của hoa sen tạo nên khung cảnh rất đặc biệt.

3. Vườn sen Tam Đa - Hưng Yên
Là vườn sen lớn nhất miền Bắc với diện tích gần 10 hecta. Nơi đây trồng nhiều giống sen quý như sen Tây Hồ, sen trắng Bách Diệp, sen Nhật Bản... Đặc biệt có dịch vụ chụp ảnh với trang phục áo dài giữa đồng sen rất được giới trẻ yêu thích.

4. Đầm Đình Mỗ - Hà Nội
Cách trung tâm Hà Nội khoảng 20km, đầm sen Đình Mỗ nổi tiếng với diện tích rộng và cảnh quan hoang sơ. Thời điểm đẹp nhất là tháng 6-7, khi hoa sen nở rộ, cả một vùng trời xanh ngắt, nước trong vắt, hoa sen hồng trắng điểm xuyết.

5. Chùa Hương - Hà Nội
Ngoài cảnh đẹp tâm linh, khu vực chùa Hương còn có nhiều đầm sen đẹp. Kết hợp tham quan chùa chiền với ngắm sen là một trải nghiệm thú vị cho chuyến du lịch cuối tuần.

Lưu ý khi đi ngắm sen:
- Mùa sen thường từ tháng 5 đến tháng 9
- Nên đi vào buổi sáng sớm (5-7h) để ngắm sen đẹp nhất
- Mang theo máy ảnh và kem chống nắng
- Giữ gìn vệ sinh, không hái hoa, không vứt rác bừa bãi
- Tôn trọng người dân và không phá hoại đồng sen`,
      tags: ["du lịch", "địa điểm", "miền bắc", "hà nội"],
    },
    {
      id: 7,
      title: "Công dụng tuyệt vời của hạt sen đối với sức khỏe",
      excerpt:
        "Tìm hiểu về những lợi ích sức khỏe tuyệt vời từ hạt sen - vị thuốc quý trong Đông y và thực phẩm bổ dưỡng",
      image:
        "https://images.unsplash.com/photo-1749117631945-cbb1ff99c03d?w=600&q=75",
      category: "Sức khỏe",
      date: "05/10/2025",
      author: "Bác sĩ Lê Minh Khôi",
      readTime: "6 phút đọc",
      content: `Hạt sen không chỉ là nguyên liệu thông dụng trong ẩm thực mà còn là vị thuốc quý trong Đông y với nhiều công dụng tuyệt vời cho sức khỏe:

1. Bổ tim, dưỡng tâm, giúp ngủ ngon
Theo Đông y, hạt sen có vị ngọt, tính bình, vào kinh tâm, tỳ, thận. Hạt sen có tác dụng bổ tỳ, ích thận, dưỡng tâm, an thần. Người hay bị mất ngủ, tim đập nhanh có thể dùng hạt sen để cải thiện tình trạng này.

2. Tốt cho hệ tiêu hóa
Hạt sen giàu chất xơ, giúp cải thiện tiêu hóa, chống táo bón. Ngoài ra, hạt sen còn có tác dụng cố tinh, chỉ lỵ, rất tốt cho người bị tiêu chảy mãn tính.

3. Giảm stress, chống trầm cảm
Các nghiên cứu hiện đại cho thấy hạt sen chứa isoquinoline alkaloids có khả năng giảm căng thẳng, lo âu và cải thiện tâm trạng. Đây là thực phẩm tự nhiên giúp chống trầm cảm rất hiệu quả.

4. Kiểm soát đường huyết
Hạt sen có chỉ số đường huyết (GI) thấp, giúp ổn định đường huyết, thích hợp cho người tiểu đường. Protein và chất xơ trong hạt sen giúp làm chậm quá trình hấp thụ đường.

5. Tốt cho phụ nữ mang thai
Hạt sen giàu folate, sắt, protein và các vitamin nhóm B rất tốt cho bà bầu và thai nhi. Giúp phòng ngừa thiếu máu, tốt cho sự phát triển của thai nhi.

6. Chống lão hóa
Hạt sen chứa nhiều chất chống oxi hóa như flavonoid, phenolic giúp bảo vệ tế bào khỏi tổn thương do gốc tự do, làm chậm quá trình lão hóa.

Cách sử dụng hạt sen:
- Nấu chè hạt sen với đường phèn
- Thêm vào súp, cháo dinh dưỡng
- Làm nhân bánh trung thu, bánh dẻo
- Pha trà hạt sen kết hợp với táo đỏ, nhãn nhục

Lưu ý: Người có chức năng tiêu hóa kém, hay bị đầy bụng khó tiêu không nên ăn nhiều hạt sen. Nên tham khảo ý kiến bác sĩ trước khi dùng hạt sen làm thuốc.`,
      tags: ["sức khỏe", "hạt sen", "dinh dưỡng", "đông y"],
    },
    {
      id: 8,
      title: "Hướng dẫn trồng sen cảnh tại nhà cho người mới bắt đầu",
      excerpt:
        "Chi tiết từng bước để trồng và chăm sóc sen cảnh tại nhà, phù hợp cho cả không gian nhỏ như ban công chung cư",
      image:
        "https://images.unsplash.com/photo-1759240096601-5e2cf23b42f4?w=600&q=75",
      category: "Hướng dẫn",
      date: "01/10/2025",
      author: "Vũ Thị Lan",
      readTime: "8 phút đọc",
      content: `Trồng sen cảnh tại nhà không khó như bạn nghĩ. Với một chậu hoặc thùng xốp, bạn hoàn toàn có thể tự tay trồng và chăm sóc sen ngay tại ban công nhà mình. Dưới đây là hướng dẫn chi tiết:

Chuẩn bị dụng cụ và vật liệu
- Chậu hoặc thùng xốp to (đường kính tối thiểu 40cm, sâu 30cm)
- Đất phù sa hoặc đất vườn pha trộn phân hữu cơ
- Củ sen giống hoặc hạt sen
- Nước sạch
- Phân bón hữu cơ

Cách trồng từ củ sen
Bước 1: Chọn củ sen khỏe mạnh, không bị sâu bệnh, có mầm non phát triển tốt.

Bước 2: Cho đất vào chậu khoảng 15-20cm, trộn đều với phân hữu cơ. Đất nên giữ độ ẩm vừa phải.

Bước 3: Đặt củ sen nằm ngang trên mặt đất, phần mầm hướng lên trên. Phủ thêm một lớp đất mỏng khoảng 5cm lên trên.

Bước 4: Đổ nước vào chậu cho đến khi ngập mặt đất khoảng 5-10cm. Trong quá trình cây phát triển, dần dần tăng mực nước lên 15-20cm.

Cách gieo từ hạt sen
Bước 1: Mài mòn phần đỉnh nhọn của hạt sen để nước dễ thẩm thấu.

Bước 2: Ngâm hạt trong nước ấm (30-35 độ C) khoảng 3-5 ngày, thay nước mỗi ngày. Hạt sẽ nảy mầm sau vài ngày.

Bước 3: Khi mầm dài khoảng 5-10cm và có rễ, chuyển sang trồng trong chậu như hướng dẫn trên.

Chăm sóc sen cảnh
1. Ánh sáng: Sen cần ít nhất 6 tiếng nắng mỗi ngày. Đặt chậu ở nơi có nhiều ánh sáng tự nhiên.

2. Nước: Luôn giữ mực nước ổn định, không để cạn nước. Sử dụng nước sạch, tránh nước có nhiều clo.

3. Bón phân: Sau 1 tháng, bón phân hữu cơ hoặc phân NPK chậm tan 2 tuần/lần. Bón ít thôi, tránh thừa phân gây hỏng rễ.

4. Vệ sinh: Thường xuyên vớt lá úa, hoa tàn để tránh thối làm hỏng nước.

5. Thay nước: 1-2 tháng thay nước một lần, vệ sinh chậu và bổ sung đất mới nếu cần.

Xử lý sâu bệnh
- Rệp: Dùng nước xà phòng hoặc thuốc trừ rệp sinh học phun vào lá
- Sâu cuốn lá: Bắt sâu thủ công hoặc dùng thuốc sinh học
- Nấm bệnh: Cắt bỏ phần bị bệnh, phun thuốc diệt nấm

Thời gian ra hoa
Nếu trồng từ củ, sen sẽ ra hoa sau 2-3 tháng. Nếu gieo từ hạt, cần 6-8 tháng mới có hoa. Hoa sen thường nở vào buổi sáng sớm và khép lại vào chiều tối.

Với sự kiên trì và chăm sóc đúng cách, bạn sẽ có được chậu sen đẹp, mang lại không gian xanh mát và thanh tịnh cho ngôi nhà.`,
      tags: ["trồng sen", "hướng dẫn", "chăm sóc cây", "làm vườn"],
    },
    {
      id: 9,
      title: "Món ăn ngon từ sen - Đặc sản ba miền",
      excerpt:
        "Khám phá những món ăn truyền thống được chế biến từ các bộ phận của cây sen, mang hương vị đặc trưng của từng vùng miền",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=75",
      category: "Ẩm thực",
      date: "28/09/2025",
      author: "Chef Nguyễn Đức Tài",
      readTime: "7 phút đọc",
      content: `Cây sen không chỉ có hoa đẹp mà còn cho ra nhiều nguyên liệu quý để chế biến các món ăn bổ dưỡng, mang đậm hương vị Việt. Cùng khám phá những món ăn ngon từ sen:

Món ăn từ hạt sen

1. Chè hạt sen long nhãn
Món chè truyền thống miền Bắc với hạt sen tươi, long nhãn, táo đỏ nấu với đường phèn. Món ăn thanh mát, bổ dưỡng, có tác dụng dưỡng tâm, an thần.

2. Bánh trung thu nhân hạt sen
Nhân bánh làm từ hạt sen xay nhuyễn, trộn với đường, mỡ thơm. Vị béo ngậy, ngọt dịu đặc trưng khó có loại nhân nào sánh được.

3. Hạt sen nhồi thịt
Món ăn độc đáo của Huế, hạt sen tươi được khoét lõi, nhồi thịt băm ướp gia vị rồi hấp chín. Ăn kèm với nước chấm chua ngọt rất ngon.

Món ăn từ củ sen (ngó sen)

4. Ngó sen xào tỏi
Món xào giòn ngọt, thanh mát, giúp thanh nhiệt, mát gan. Củ sen được thái lát mỏng, xào nhanh với tỏi, rau cần, nêm nếm vừa ăn.

5. Ngó sen nhồi thịt
Củ sen được thái khúc, khoét lõi rồi nhồi thịt ướp gia vị, hấp hoặc kho. Món ăn bổ dưỡng, thích hợp cho bữa cơm gia đình.

6. Salad củ sen
Món ăn hiện đại, củ sen luộc chín trộn với rau củ tươi, thịt gà, tôm, rưới nước sốt chua ngọt. Vừa ngon vừa tốt cho sức khỏe.

Món ăn từ lá sen

7. Cơm sen
Cơm được gói trong lá sen rồi hấp chín, thơm mùi lá sen đặc trưng. Có thể thêm gà, lạp xưởng, hạt sen để tăng vị.

8. Gà hấp lá sen
Món ăn dân dã nhưng hấp dẫn, thịt gà ướp gia vị, gói trong lá sen tươi rồi hấp chín. Thịt gà mềm, thấm gia vị và mùi thơm của lá sen.

Món ăn từ tâm sen (lõi sen)

9. Trà tâm sen
Đây là loại trà quý, có tác dụng thanh nhiệt, giải độc, giúp ngủ ngon. Lõi sen khô được pha với nước nóng, uống vào buổi tối rất tốt.

10. Tâm sen ngâm mật ong
Tâm sen tươi ngâm với mật ong nguyên chất, để trong tủ lạnh. Mỗi ngày dùng vài cọng, giúp giảm stress, dễ ngủ.

Món canh từ sen

11. Canh sườn hầm hạt sen
Món canh bổ dưỡng, sườn hầm mềm cùng hạt sen, củ sen, tạo ra nước canh ngọt thanh, bổ dưỡng.

Những món ăn từ sen không chỉ ngon mà còn rất tốt cho sức khỏe. Hãy thử chế biến để mang đến những bữa ăn bổ dưỡng cho gia đình bạn nhé!`,
      tags: ["ẩm thực", "món ăn", "chế biến", "đặc sản"],
    },
    {
      id: 10,
      title: "Lịch sử và nguồn gốc của hoa sen tại Việt Nam",
      excerpt:
        "Tìm hiểu về hành trình hàng ngàn năm của hoa sen gắn bó với đất nước và con người Việt Nam qua các thời kỳ lịch sử",
      image:
        "https://images.unsplash.com/photo-1749117631945-cbb1ff99c03d?w=600&q=75",
      category: "Lịch sử",
      date: "25/09/2025",
      author: "PGS.TS Hoàng Văn Nam",
      readTime: "8 phút đọc",
      content: `Hoa sen đã có mặt tại Việt Nam từ rất lâu, gắn bó mật thiết với lịch sử và văn hóa dân tộc qua hàng ngàn năm. Hành trình của loài hoa này tại mảnh đất hình chữ S là một câu chuyện đầy thú vị.

Nguồn gốc của hoa sen

Theo các nhà khảo cổ học, hoa sen đã xuất hiện tại Việt Nam từ thời tiền sử, khoảng 3000-4000 năm trước. Các di tích khảo cổ ở Bắc Bộ đã tìm thấy hạt sen trong các địa tầng văn hóa cổ, chứng minh sen đã được người Việt cổ sử dụng từ rất sớm.

Sen trong thời kỳ dựng nước

Thời Hùng Vương, người Việt cổ đã biết sử dụng sen làm thực phẩm và thuốc chữa bệnh. Truyền thuyết kể rằng các vị Vua Hùng rất yêu thích hoa sen, coi đây là loài hoa thiêng liêng, biểu tượng cho sự thanh cao.

Thời Bắc thuộc, mặc dù chịu ảnh hưởng của văn hóa phương Bắc, nhưng người Việt vẫn giữ gìn truyền thống trồng sen và sử dụng sen trong đời sống.

Sen và Phật giáo

Khi Phật giáo du nhập vào Việt Nam (khoảng thế kỷ II), hoa sen càng trở nên quan trọng hơn. Trong Phật giáo, sen là biểu tượng của sự giác ngộ, thanh tịnh. Từ đó, sen được trồng nhiều tại các ngôi chùa, trở thành một phần không thể thiếu trong kiến trúc tâm linh Việt Nam.

Thời Lý - Trần, các vua chúa rất chuộng sen. Vua Lý Thái Tông đã cho đào ao, trồng sen trong cung điện. Các công trình kiến trúc thời này đều có họa tiết sen trang trí, từ cột đá, mái chùa đến các đồ thờ cúng.

Sen trong thời kỳ phong kiến

Các triều đại phong kiến sau này như Lê, Nguyễn đều đặc biệt chú trọng đến sen. Nhiều vua quan yêu thích hoa sen, làm thơ ca ngợi vẻ đẹp của sen. Nhà thơ Nguyễn Du trong "Truyện Kiều" cũng có nhiều đoạn miêu tả hoa sen đầy ấn tượng.

Các vùng trồng sen nổi tiếng được hình thành như sen Tây Hồ (Hà Nội), sen Đồng Tháp, sen Hà Tiên... Mỗi vùng có đặc điểm riêng, tạo nên sự đa dạng về giống sen Việt Nam.

Sen trong thời hiện đại

Ngày nay, sen vẫn giữ vị trí đặc biệt trong đời sống người Việt. Sen không chỉ là cây cảnh, nguồn thực phẩm mà còn là biểu tượng văn hóa, xuất hiện trong các tác phẩm nghệ thuật, văn học, hội họa.

Việt Nam hiện là một trong những nước trồng sen lớn nhất thế giới, với diện tích hàng chục nghìn hecta. Sen Việt Nam được xuất khẩu sang nhiều nước, góp phần quảng bá hình ảnh đất nước con người Việt Nam.

Nhiều nghiên cứu khoa học về sen được tiến hành, nhằm bảo tồn và phát triển các giống sen quý. Các lễ hội sen được tổ chức thường niên ở nhiều địa phương, thu hút hàng triệu lượt khách tham quan.

Hoa sen - một phần không thể tách rời của văn hóa Việt Nam, vẫn tiếp tục khoe sắc và tỏa hương trên mảnh đất hình chữ S, gắn kết quá khứ với hiện tại, truyền thống với hiện đại.`,
      tags: ["lịch sử", "văn hóa", "nguồn gốc", "truyền thống"],
    },
  ];

  // Customer reviews data - using useState to allow updates
  const [customerReviews, setCustomerReviews] = useState([
    {
      id: 1,
      name: "Nguyễn Thị Lan Anh",
      rating: 5,
      comment:
        "Sen Đồng Tháp mua ở đây thật sự tuyệt vời! Hoa tươi lắm, nở rộ và giữ được 6 ngày mới tàn. Mùi thơm nhẹ nhàng, không hắc như mấy nơi khác. Giao hàng cũng rất nhanh, đặt sáng chiều đã có hàng. Chủ shop nhiệt tình, tư vấn cách bảo quản hoa rất chi tiết. Nhà mình thờ Phật nên hay mua sen, từ giờ sẽ đặt cố định ở đây. Giá cả hợp lý, chất lượng xứng đáng!",
      date: "28/10/2025",
      productName: "Sen Đồng Tháp",
      images: [
        "https://images.unsplash.com/photo-1758466872590-0467259084de?w=400&q=80",
        "https://images.unsplash.com/photo-1690087938677-a2b27fe32270?w=400&q=80",
      ],
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      rating: 5,
      comment:
        "Mua Sen Thái để trang trí bàn thờ tổ tiên, chất lượng tuyệt vời! Bông sen to, cánh hoa dày và màu hồng rất đẹp mắt. Đóng gói cẩn thận, giao hàng đúng hẹn. Sẽ giới thiệu cho bạn bè và đặt hàng lần sau. Shop này đáng tin cậy!",
      date: "25/10/2025",
      productName: "Bông Sen Thái",
    },
    {
      id: 3,
      name: "Lê Thị Mai",
      rating: 5,
      comment:
        "Lần đầu mua sen online, ban đầu còn lo lắng chất lượng, nhưng khi nhận được hàng thì rất hài lòng. Sen Việt truyền thống này giữ nguyên được vẻ đẹp tự nhiên, không bị dập nát hay héo. Thân hoa chắc khỏe, lá xanh tươi. Mình cắm được 5 ngày vẫn đẹp. Giá cả phải chăng, phù hợp với túi tiền. Chắc chắn sẽ ủng hộ shop dài lâu!",
      date: "22/10/2025",
      productName: "Bông Sen Việt",
    },
    {
      id: 4,
      name: "Phạm Hoàng Long",
      rating: 5,
      comment:
        "Sen đẹp quá! Mua về cúng rằm, cả nhà đều khen. Hoa tươi, thơm tự nhiên, không bị ướp hóa chất gì cả. Đặc biệt là nhị sen vàng óng rất đẹp. Giao hàng siêu nhanh, đặt tối hôm trước sáng đã nhận được. Chủ shop tư vấn nhiệt tình, hướng dẫn cách cắm và bảo quản chi tiết. 10 điểm cho shop!",
      date: "20/10/2025",
      productName: "Sen Đồng Tháp",
      images: [
        "https://images.unsplash.com/photo-1556565149-aa2ec6c5eceb?w=400&q=80",
      ],
    },
    {
      id: 5,
      name: "Hoàng Thị Hương",
      rating: 4,
      comment:
        "Sen đẹp và tươi, nhưng một bông hơi nhỏ hơn mình nghĩ. Mùi thơm nhẹ dễ chịu, giữ được 4 ngày. Giao hàng đúng hẹn. Nhìn chung vẫn hài lòng, sẽ tiếp tục ủng hộ shop. Lần sau có thể chọn bông to hơn một chút.",
      date: "18/10/2025",
      productName: "Bông Sen Thái",
    },
    {
      id: 6,
      name: "Đỗ Minh Tuấn",
      rating: 5,
      comment:
        "Mua sen về chụp ảnh, không thất vọng! Bông sen nở vừa đẹp, màu sắc tươi sáng lên ảnh cực kỳ ấn tượng. Thân dài vừa phải, dễ cắm và bố cục. Shop giao đúng giờ như đã hẹn. Đóng gói rất cẩn thận, không bị gãy hay dập. Giá hợp lý, chất lượng xứng đáng. Lần sau có dịp sẽ mua tiếp!",
      date: "15/10/2025",
      productName: "Sen Đồng Tháp",
      images: [
        "https://images.unsplash.com/photo-1690087938677-a2b27fe32270?w=400&q=80",
        "https://images.unsplash.com/photo-1687557862593-1dcee949e52f?w=400&q=80",
        "https://images.unsplash.com/photo-1759772237984-7dfaf867acc0?w=400&q=80",
      ],
    },
    {
      id: 7,
      name: "Vũ Thị Thanh",
      rating: 5,
      comment:
        "Sen Việt truyền thống này rất hợp với gia đình mình. Hoa có vẻ đẹp dân dã, mộc mạc nhưng rất đẹp và trang nhã. Giá rẻ hơn các loại khác nhưng chất lượng không hề thua kém. Mua về cắm trong nhà, không gian trở nên thanh tịnh hơn hẳn. Shop phục vụ tận tâm, giao hàng nhanh. Rất đáng để thử!",
      date: "12/10/2025",
      productName: "Bông Sen Việt",
    },
    {
      id: 8,
      name: "Bùi Văn Hải",
      rating: 5,
      comment:
        "Đặt sen cúng khai trương cửa hàng, shop giao đúng giờ, đúng số lượng và chất lượng vượt mong đợi! 20 bông sen đều tươi đẹp, nở rộ. Khách mời ai cũng khen. Đóng gói chuyên nghiệp, vận chuyển cẩn thận. Giá mua số lượng lớn được chiết khấu hợp lý. Chủ shop rất dễ thương và nhiệt tình. Chắc chắn sẽ là đối tác lâu dài của công ty mình!",
      date: "10/10/2025",
      productName: "Sen Đồng Tháp",
      images: [
        "https://images.unsplash.com/photo-1687557862593-1dcee949e52f?w=400&q=80",
        "https://images.unsplash.com/photo-1758466872590-0467259084de?w=400&q=80",
      ],
    },
    {
      id: 9,
      name: "Ngô Thị Kim Anh",
      rating: 5,
      comment:
        "Lần thứ 3 mua sen ở shop rồi, lần nào cũng hài lòng! Sen luôn tươi, đẹp và thơm. Đặc biệt là Sen Thái của shop có màu hồng rất đặc biệt, cắm lên bàn thờ trông sang trọng lắm. Thời gian giữ hoa tươi lâu hơn so với các shop khác mình từng mua. Chủ shop thân thiện, nhiệt tình. Giá cả ổn định, không tăng giảm thất thường. Rất tin tưởng!",
      date: "08/10/2025",
      productName: "Bông Sen Thái",
      images: [
        "https://images.unsplash.com/photo-1556565149-aa2ec6c5eceb?w=400&q=80",
        "https://images.unsplash.com/photo-1759772237984-7dfaf867acc0?w=400&q=80",
      ],
    },
    {
      id: 10,
      name: "Đinh Công Minh",
      rating: 4,
      comment:
        "Sen đẹp, tươi và thơm. Giao hàng khá nhanh trong vòng 2 giờ. Giá hơi cao một chút so với chợ nhưng chất lượng tốt hơn và tiện lợi vì được giao tận nhà. Đóng gói cẩn thận, không bị hư hại. Sẽ ủng hộ shop tiếp. Nếu có thêm ưu đãi cho khách quen thì tuyệt vời!",
      date: "05/10/2025",
      productName: "Bông Sen Việt",
    },
    {
      id: 11,
      name: "Trương Thị Hồng",
      rating: 5,
      comment:
        "Mua sen tặng mẹ nhân ngày sinh nhật, mẹ rất thích! Hoa đẹp, tươi và ý nghĩa. Shop còn tặng kèm thiệp chúc mừng rất đẹp và ý nghĩa. Giao đúng giờ như đã hẹn, bọc hoa đẹp mắt. Giá cả hợp lý. Dịch vụ chuyên nghiệp, chu đáo. Cảm ơn shop đã giúp mình có một món quà ý nghĩa!",
      date: "02/10/2025",
      productName: "Sen Đồng Tháp",
      images: [
        "https://images.unsplash.com/photo-1695102850364-881965890bb5?w=400&q=80",
      ],
    },
    {
      id: 12,
      name: "Phan Văn Đức",
      rating: 5,
      comment:
        "Sen tươi lắm, mua về cúng Phật rất ưng ý. Bông nở vừa đủ, không quá nở cũng không còn nụ. Màu sắc tự nhiên, thơm dịu nhẹ. Thân hoa dài, cắm bình nào cũng đẹp. Shop tư vấn nhiệt tình, hướng dẫn chi tiết cách chăm sóc để hoa tươi lâu. Giao hàng đúng hẹn. Giá tốt, chất lượng đảm bảo. Sẽ giới thiệu cho mọi người!",
      date: "30/09/2025",
      productName: "Bông Sen Thái",
    },
    {
      id: 13,
      name: "Lý Thị Ngọc",
      rating: 5,
      comment:
        "Mình hay mua sen để trang trí nhà và cúng Phật. Đã thử nhiều shop nhưng shop này là ưng ý nhất! Sen luôn tươi, đẹp, giá ổn định. Đặc biệt là dịch vụ giao hàng rất nhanh, có khi đặt 30 phút là đã có hàng. Chủ shop thân thiện, nhiệt tình tư vấn. Đóng gói cẩn thận, chuyên nghiệp. Shop này là lựa chọn số 1 của gia đình mình!",
      date: "28/09/2025",
      productName: "Sen Đồng Tháp",
      images: [
        "https://images.unsplash.com/photo-1759772237984-7dfaf867acc0?w=400&q=80",
        "https://images.unsplash.com/photo-1690087938677-a2b27fe32270?w=400&q=80",
      ],
    },
    {
      id: 14,
      name: "Cao Minh Hà",
      rating: 5,
      comment:
        "Lần đầu mua Sen Việt, không ngờ đẹp và thơm đến vậy! Vẻ đẹp mộc mạc, tự nhiên rất hợp với không gian nhà mình. Giá rất phải chăng, chỉ 40k mà được bông to, tươi. Giữ được gần 1 tuần mới tàn. Giao hàng nhanh, đóng gói cẩn thận. Chủ shop dễ thương, nhiệt tình. Sẽ ủng hộ shop lâu dài và giới thiệu cho bạn bè!",
      date: "25/09/2025",
      productName: "Bông Sen Việt",
    },
  ]);

  // === XỬ LÝ SẢN PHẨM ===
  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToProducts = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    setProductImageIndex(0);
  };

  // === XỬ LÝ TIN TỨC ===
  const handleReadMore = (newsId: string | number) => {
    const id = Number(newsId); // 🔹 ép kiểu về number cho chắc
    const news = newsArticles.find((n) => n.id === id);

    if (news) {
      setSelectedNews(news);
      setShowNewsDetail(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToNews = () => {
    setShowNewsDetail(false);
    setSelectedNews(null);
    setTimeout(() => {
      const element = document.getElementById("news");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNavigateToMain = () => {
    setShowProductDetail(false);
    setShowNewsDetail(false);
    setSelectedProduct(null);
    setSelectedNews(null);
    setProductImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // === FORM LIÊN HỆ ===
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Cảm ơn bạn đã liên hệ!");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      product: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:0123456789";
  };

  // === ĐÁNH GIÁ ===
  const toggleExpandReview = (id: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleReviewSubmitWithData = (data: any) => {
    const newReview = {
      id: Math.max(...customerReviews.map((r) => r.id), 0) + 1,
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      date: new Date().toLocaleDateString("vi-VN"),
      productName: data.product,
      images: data.images?.map((file: File) => URL.createObjectURL(file)),
    };
    setCustomerReviews((prev) => [newReview, ...prev]);
    toast.success("Đánh giá đã được thêm!");
    setShowReviewForm(false);
    setTimeout(() => {
      document
        .querySelector('[class*="Đánh giá"]')
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleReviewCancel = () => setShowReviewForm(false);
  const handleDeleteReview = (id: number, name: string) =>
    toast.success(`Đã xóa đánh giá của ${name}`);
  const handleOrder = (productName: string) =>
    toast.info(`Đang xử lý đơn: ${productName}`);

  // === RENDER CHI TIẾT SẢN PHẨM ===
  if (showProductDetail && selectedProduct) {
    return (
      <ProductDetailPage
        selectedProduct={selectedProduct}
        products={[]}
        newsArticles={newsArticles}
        productImageIndex={productImageIndex}
        setProductImageIndex={setProductImageIndex}
        onBack={handleBackToProducts}
      />
    );
  }

  // === RENDER CHI TIẾT TIN TỨC ===
  if (showNewsDetail && selectedNews) {
    return (
      <NewsDetailPage
        selectedNews={selectedNews}
        handleBackToNews={handleBackToNews}
        handleReadMore={handleReadMore}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Sen Việt - Hoa Sen Tươi Chất Lượng Cao</title>
        <meta
          name="description"
          content="Sen Việt chuyên cung cấp hoa sen tươi cao cấp..."
        />
      </Helmet>

      <Toaster />

      <div className="relative min-h-screen overflow-hidden">
        {/* SUBTLE PINK BACKGROUND - FIGMA STYLE */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Soft Pink Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100/50"></div>

          {/* Floating Lotus Flowers - Soft Pink Tones */}
          <motion.div
            className="absolute top-20 left-10"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flower
              className="w-16 h-16 md:w-20 md:h-20"
              style={{ color: "rgba(251, 207, 232, 0.4)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/4 right-16"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Flower
              className="w-24 h-24 md:w-28 md:h-28"
              style={{ color: "rgba(244, 114, 182, 0.35)" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 left-1/4"
            animate={{
              y: [0, -18, 0],
              rotate: [0, 4, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          >
            <Flower
              className="w-20 h-20 md:w-24 md:h-24"
              style={{ color: "rgba(251, 207, 232, 0.3)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-2/3 right-1/4"
            animate={{
              y: [0, 12, 0],
              rotate: [0, -3, 0],
              x: [0, -8, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Flower
              className="w-14 h-14 md:w-16 md:h-16"
              style={{ color: "rgba(236, 72, 153, 0.3)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-16"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.07, 1],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <Flower
              className="w-18 h-18 md:w-22 md:h-22"
              style={{ color: "rgba(251, 207, 232, 0.35)" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-12"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -4, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          >
            <Flower
              className="w-16 h-16 md:w-20 md:h-20"
              style={{ color: "rgba(244, 114, 182, 0.4)" }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/3 left-1/3"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 6, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6,
            }}
          >
            <Flower
              className="w-14 h-14 md:w-18 md:h-18"
              style={{ color: "rgba(251, 207, 232, 0.3)" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-1/2 right-1/3"
            animate={{
              y: [0, 18, 0],
              rotate: [0, -6, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 7,
            }}
          >
            <Flower
              className="w-20 h-20 md:w-24 md:h-24"
              style={{ color: "rgba(236, 72, 153, 0.35)" }}
            />
          </motion.div>

          {/* Floating Stars/Sparkles - Pink Sparkles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-300/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Soft Pink Gradient Orbs */}
          <motion.div
            className="absolute top-1/3 left-10 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/3 right-10 w-56 h-56 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <SharedHeader
            onNavigateToMain={handleNavigateToMain}
            onPhoneCall={handlePhoneCall}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            products={[]} // Không cần truyền products → Header tự fetch nếu cần
            newsArticles={newsArticles}
            onProductClick={handleProductClick}
            onNewsClick={handleReadMore}
          />
          <HeroSection
            handleBuyNow={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
          {/* ProductsSection tự fetch API */}
          <ProductsSection onProductClick={handleProductClick} />

          <NewsSection handleReadMore={handleReadMore} />
          <ContactSection />
          <SharedFooter onNavigateToMain={handleNavigateToMain} />
        </div>
      </div>

      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AppContent />
    </HelmetProvider>
  );
}
