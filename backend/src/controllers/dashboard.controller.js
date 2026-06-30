const dashboardService = require("../services/dashboard.service");
const { success } = require("../utils/response");

const getStats = async (req, res, next) => {
  try {
    const data = await dashboardService.getStats(req.user.id);
    return success(res, data, "Dashboard stats retrieved");
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
