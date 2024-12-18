const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require("morgan");
const dotenv = require('dotenv');
const Tour = require('./models/ds_tour_nuoc_ngoai');
dotenv.config();

const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001

app.use(cors());
app.use(morgan("common"));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL,{
  dbName: 'happy_journey_vietnam' // Thay "ten_database" bằng tên của cơ sở dữ liệu của bạn
})
.then(() => {
    console.log('Connected to MongoDB');
    // Khi kết nối thành công, bạn có thể thực hiện các hành động khác ở đây
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dattourhappyjourneyvietnam:Thai4027@@cluster0.0i2dlf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



// Middleware để xử lý dữ liệu gửi từ form
app.use(bodyParser.urlencoded({ extended: false }));


// Định nghĩa endpoint để xử lý gửi email từ form
const transporter = nodemailer.createTransport({
    // Thay thế các thông tin này bằng thông tin SMTP của bạn
    service: 'gmail',
    auth: {
        user: 'dattourhappyjourneyvietnam@gmail.com',
        pass: 'uudqwsmvvasjnvxz'
    }
});


app.post('/send-email', (req, res) => {
    const { from_name, from_phone, from_email, from_start, from_end, calltime, comments } = req.body;

    const mailOptions = {
        from: 'dattourhappyjourneyvietnam@gmail.com', // Your Gmail email address
        to: 'dulichhappyjourney@gmail.com', // Destination email address
        subject: 'Đặt tour từ website',
        html: `
            <p><strong>Tên:</strong> ${from_name}</p>
            <p><strong>Số điện thoại:</strong> ${from_phone}</p>
            <p><strong>Email:</strong> ${from_email}</p>
            <p><strong>Điểm khởi hành:</strong> ${from_start}</p>
            <p><strong>Điểm đến:</strong> ${from_end}</p>
            <p><strong>Thời gian tư vấn mong muốn:</strong> ${calltime}</p>
            <p><strong>Ghi chú:</strong> ${comments}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Đã có lỗi xảy ra, vui lòng thử lại sau.');
        } else {
            console.log('Email sent: ' + info.response);  
            res.send(`
                <script>
                    alert('Email đã được gửi thành công.');
                    window.location.href = '/'; // Chuyển hướng người dùng về trang chính
                </script>
            `);                                         
        }
    });
});




// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Serve HTML files
app.get('/ds_tour_nuoc_ngoai', async (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', 'ds_tour_nuoc_ngoai.html'));  
});
app.get('/ds_tour_nuoc_ngoai_data', async (req, res) => {
    try {
        // Lấy dữ liệu từ MongoDB
        const tours = await Tour.find({ khu_vuc: "Trung Quốc" });
        const tours1 = await Tour.find({ khu_vuc: "Nam Á" });
        const tours2 = await Tour.find({ khu_vuc: "Tour trải nhiệm đặc biệt" });

        // Trả về dữ liệu dưới dạng JSON
        res.json({ tours, tours1, tours2 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});


// Thiết lập multer để xử lý tải ảnh lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public','img'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Xử lý yêu cầu POST từ client để tải ảnh lên
app.post('/upload', upload.single('image'), (req, res) => {
    res.send('Image uploaded successfully');
});


// Serve HTML files
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/hainam_tama_haihoadao', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'hainam_tama_haihoadao.html'));
});
app.get('/hoang_son-vong_tien_coc-thuy_muc_hoanh_thon', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'hoang_son-vong_tien_coc-thuy_muc_hoanh_thon.html'));
});



app.get('/tay_an-lac_duong-thieu_lam_tu-khai_phong-trinh_chau', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'tay_an-lac_duong-thieu_lam_tu-khai_phong-trinh_chau.html'));
});
app.get('/bac_cuong', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'bac_cuong.html'));
});
app.get('/cam_tuc', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'cam_tuc.html'));
});
app.get('/cu_chau-phim_truong_hoanh_diem-than_tien_cu', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'cu_chau-phim_truong_hoanh_diem-than_tien_cu.html'));
});
app.get('/dao_hai_nam', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'dao_hai_nam.html'));
});
app.get('/hanh_huong_an_do_nepal', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'hanh_huong_an_do_nepal.html'));
});
app.get('/mumbai', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'mumbai.html'));
});
app.get('/nam_bac_tan_cuong', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'nam_bac_tan_cuong.html'));
});
app.get('/sikkim', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'sikkim.html'));
});
app.get('/tay_tang_everest', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'tay_tang_everest.html'));
});
app.get('/tay_tang_mot_chang_tau', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'tay_tang_mot_chang_tau.html'));
});
app.get('/dattour', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'dattour.html'));
});
// app.get('/ds_tour_nuoc_ngoai', function (req, res) {
//     res.sendFile(path.join(__dirname, 'views', 'ds_tour_nuoc_ngoai.html'));
// });

app.get('/ds_tour_nuoc_ngoai', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'ds_tour_nuoc_ngoai.html'));
});
app.get('/ds_tour_trong_nuoc', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'ds_tour_trong_nuoc.html'));
});
app.get('/bac_kinh-to_chau-hang_chau-thuong_hai', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'bac_kinh-to_chau-hang_chau-thuong_hai.html'));
});
app.get('/cuu_trai_cau', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'cuu_trai_cau.html'));
});
app.get('/nam_ninh-le_giang-shangrila', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'nam_ninh-le_giang-shangrila.html'));
});
app.get('/nam_cam_tuc-tay_an', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'nam_cam_tuc-tay_an.html'));
});
app.get('/upimg', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'up_img.html'));
});
app.get('/gioi_thieu', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'gioi_thieu.html'));
});
app.get('/sitemap', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'sitemap.xml'));
});
app.use((req, res, next) => {
    res.status(404).send('Đường dẫn không tồn tại');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
