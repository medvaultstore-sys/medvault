import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "orders.json");

async function readOrders() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders) {
  await fs.writeFile(DB_PATH, JSON.stringify(orders, null, 2));
}

export async function getAllOrders() {
  return readOrders();
}

export async function createOrder(order) {
  const orders = await readOrders();
  const newOrder = {
    ...order,
    _id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  await writeOrders(orders);
  return newOrder;
}

export async function updateOrderStatus(id, status) {
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o._id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  await writeOrders(orders);
  return orders[idx];
}
