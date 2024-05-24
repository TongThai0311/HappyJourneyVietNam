const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    anh: { type: String, required: true },
    link_trang: { type: String, required: true },
    ten_tour: { type: String, required: true },
    noi_khoi_hanh: { type: String, required: true },
    mo_ta_anh: { type: String, required: true },
    khu_vuc: { type: String, required: true },
    gia: { type: String, required: true }
});

const Tour = mongoose.model('Tour', tourSchema, 'ds_tour_nuoc_ngoai');

module.exports = Tour;

