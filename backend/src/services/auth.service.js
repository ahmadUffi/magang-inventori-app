const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../utils/hash");
const { sign } = require("../utils/jwt");

const prisma = new PrismaClient();

const register = async ({ name, storeName, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, storeName, email, password: hashed },
  });

  const token = sign({ id: user.id, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, storeName: user.storeName, email: user.email },
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = sign({ id: user.id, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, storeName: user.storeName, email: user.email },
  };
};

const me = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, storeName: true, email: true, createdAt: true },
  });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { register, login, me };
