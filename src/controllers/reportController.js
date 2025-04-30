const { createReportService } = require('../services/reportService');

const createReport = async (req, res) => {
    try {
        const report = await createReportService(req.body);
        res.status(200).json({ errorCode: 0, result: report });
    } catch (error) {
        res.status(400).json({ errorCode: 1, message: error.message });
    }
};

module.exports = {
    createReport
};
