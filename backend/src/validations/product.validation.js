const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().int().positive("Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be >= 0").default(0),
  categoryId: z.string().uuid("Invalid category ID"),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().uuid().optional(),
});

module.exports = { createProductSchema, updateProductSchema };
