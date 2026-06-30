const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findAll = async (userId) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const findById = async (id, userId) => {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }
  return category;
};

const create = async (userId, { name }) => {
  return prisma.category.create({ data: { name, userId } });
};

const update = async (id, userId, { name }) => {
  await findById(id, userId);
  return prisma.category.update({ where: { id }, data: { name } });
};

const remove = async (id, userId) => {
  await findById(id, userId);

  const productCount = await prisma.product.count({ where: { categoryId: id, userId } });
  if (productCount > 0) {
    const err = new Error("Cannot delete category that has products");
    err.statusCode = 400;
    throw err;
  }

  return prisma.category.delete({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };
