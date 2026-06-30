const { z } = require("zod");

const createTransactionSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  note: z.string().optional(),
});

module.exports = { createTransactionSchema };
