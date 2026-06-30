const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

module.exports = { createCategorySchema, updateCategorySchema };
