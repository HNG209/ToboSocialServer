const Report = require('../models/report');

const createReportService = async (data) => {
    const { reporter, post, reason, description } = data;

    // Check xem đã report trùng chưa (1 user không nên report 1 post nhiều lần)
    const existed = await Report.findOne({ reporter, post });
    if (existed) throw new Error('Bạn đã báo cáo bài viết này trước đó.');

    const report = await Report.create({ reporter, post, reason, description });
    return report;
};

module.exports = {
    createReportService
};
