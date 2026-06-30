const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findAll = async (userId, query) => {
  const { type, productId, search, sortField = "createdAt", sortDir = "desc", page = 1, limit = 10 } = query;
  const where = { userId };
  if (type && ["IN", "OUT"].includes(type)) where.type = type;
  if (productId) where.productId = productId;
  if (search) {
    where.product = {
      OR: [
        { name: { contains: search } },
        { sku: { contains: search } },
      ],
    };
  }

  const allowedSort = ["createdAt", "quantity", "type"];
  const orderField = allowedSort.includes(sortField) ? sortField : "createdAt";
  const orderDir = sortDir === "asc" ? "asc" : "desc";

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      include: { product: { select: { id: true, name: true, sku: true } } },
      skip,
      take,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total };
};

const create = async (userId, { productId, type, quantity, note }) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id: productId, userId } });
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    if (type === "OUT" && product.stock < quantity) {
      const err = new Error("Stok tidak mencukupi");
      err.statusCode = 400;
      throw err;
    }

    const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;

    await tx.product.update({ where: { id: productId }, data: { stock: newStock } });

    return tx.transaction.create({
      data: { productId, type, quantity, note, userId },
      include: { product: { select: { id: true, name: true, sku: true } } },
    });
  });
};

module.exports = { findAll, create };
