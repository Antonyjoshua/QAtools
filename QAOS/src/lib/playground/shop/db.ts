import Dexie, { type EntityTable } from "dexie";
import type { Address, CartItem, Order, User, WishlistItem } from "./types";

class BrightbasketDB extends Dexie {
  users!: EntityTable<User, "id">;
  addresses!: EntityTable<Address, "id">;
  cart!: EntityTable<CartItem, "id">;
  wishlist!: EntityTable<WishlistItem, "id">;
  orders!: EntityTable<Order, "id">;

  constructor() {
    super("brightbasket-db");
    this.version(1).stores({
      users: "id, &email, createdAt",
      addresses: "id, userId, isDefault, createdAt",
      // Unique compound key: adding the same product twice always upserts quantity, never a duplicate line.
      cart: "id, &[userId+productId], userId, productId, addedAt",
      // Deliberately NOT unique — BUG-013 (duplicate wishlist entries) is an application-level dedup
      // check that gets skipped, not a DB constraint, so it needs room to actually create duplicates.
      wishlist: "id, [userId+productId], userId, productId, addedAt",
      orders: "id, displayId, userId, status, createdAt",
    });
  }
}

export const db = new BrightbasketDB();
