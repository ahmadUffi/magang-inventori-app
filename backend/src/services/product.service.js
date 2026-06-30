const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findAll = async (userId, query) => {
  const { search, categoryId, sortField: sortBy = "createdAt", sortDir = "desc" } = query;

  const where = { userId };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  const allowedSort = ["name", "price", "stock", "createdAt"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = sortDir === "asc" ? "asc" : "desc";

  return prisma.product.findMany({
    where,
    orderBy: { [sortField]: sortOrder },
    include: { category: { select: { id: true, name: true } } },
  });
};

const findById = async (id, userId) => {
  const product = await prisma.product.findFirst({
    where: { id, userId },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const create = async (userId, { name, sku, price, stock, categoryId }) => {
  const skuExists = await prisma.product.findUnique({ where: { sku } });
  if (skuExists) {
    const err = new Error("SKU already exists");
    err.statusCode = 409;
    throw err;
  }

  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.product.create({
    data: { name, sku, price, stock, categoryId, userId },
    include: { category: { select: { id: true, name: true } } },
  });
};

const update = async (id, userId, body) => {
  await findById(id, userId);

  if (body.sku) {
    const skuExists = await prisma.product.findFirst({
      where: { sku: body.sku, id: { not: id } },
    });
    if (skuExists) {
      const err = new Error("SKU already exists");
      err.statusCode = 409;
      throw err;
    }
  }

  if (body.categoryId) {
    const category = await prisma.category.findFirst({ where: { id: body.categoryId, userId } });
    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }
  }

  return prisma.product.update({
    where: { id },
    data: body,
    include: { category: { select: { id: true, name: true } } },
  });
};

const remove = async (id, userId) => {
  await findById(id, userId);
  return prisma.product.delete({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };
