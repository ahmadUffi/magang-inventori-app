const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findAll = async (userId, query) => {
  const { type, productId } = query;
  const where = { userId };
  if (type && ["IN", "OUT"].includes(type)) where.type = type;
  if (productId) where.productId = productId;

  return prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  });
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
