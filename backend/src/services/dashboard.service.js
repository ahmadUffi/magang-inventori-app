const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const LOW_STOCK_THRESHOLD = 5;

const getStats = async (userId) => {
  const [totalProducts, totalCategories, totalTransactions, lowStockProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.category.count({ where: { userId } }),
    prisma.transaction.count({ where: { userId } }),
    prisma.product.count({ where: { userId, stock: { lte: LOW_STOCK_THRESHOLD } } }),
  ]);

  return { totalProducts, totalCategories, totalTransactions, lowStockProducts };
};

module.exports = { getStats };
