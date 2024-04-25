const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Định nghĩa đường dẫn cho các tài nguyên tĩnh (ví dụ: CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Định tuyến cho đường dẫn gốc
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});
// Khởi động máy chủ
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
