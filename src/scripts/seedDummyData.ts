import "dotenv/config";
import mongoose from "mongoose";
import { dbconnect } from "../database/client";
import { env } from "../config/env";
import CategoryModel from "../database/schema/Items/CategoryModel";
import ModModel from "../database/schema/Items/ModifierModel";
import ItemModel from "../database/schema/Items/ItemModel";
import DiscountModel from "../database/schema/Discount/DiscountModel";
import TransactionsModel from "../database/schema/Transaction/TransactionModel";
import UserModel from "../database/schema/user/UserModel";
import { logger } from "../utils/logger";
import { transactionStatus, paymentMethod, transactionType } from "../modules/transactions/transaction.types";

const seedDummyData = async () => {
  try {
    logger.info("Connecting to Database...");
    await dbconnect(env.MONGO_URI);

    logger.info("Clearing existing Dummy Data...");
    await CategoryModel.deleteMany({});
    await ModModel.deleteMany({});
    await ItemModel.deleteMany({});
    await DiscountModel.deleteMany({});
    await TransactionsModel.deleteMany({});

    // get an admin/cashier user
    let user = await UserModel.findOne({ username: "admin" });
    if (!user) {
      logger.info("No user found. Please run seedAdmin first or ensure a user exists.");
      process.exit(1);
    }

    logger.info("Seeding Categories...");
    const categories = await CategoryModel.insertMany([
      { name: "Coffee" },
      { name: "Non-Coffee" },
      { name: "Pastry" },
      { name: "Main Course" },
    ]);

    logger.info("Seeding Modifiers...");
    const modifiers = await ModModel.insertMany([
      {
        groupName: "Size",
        options: [
          { name: "Regular", price: 0 },
          { name: "Large", price: 5000 },
        ],
      },
      {
        groupName: "Sweetness",
        options: [
          { name: "Normal Sugar", price: 0 },
          { name: "Less Sugar", price: 0 },
          { name: "No Sugar", price: 0 },
        ],
      },
      {
        groupName: "Milk Type",
        options: [
          { name: "Fresh Milk", price: 0 },
          { name: "Oat Milk", price: 10000 },
          { name: "Almond Milk", price: 15000 },
        ],
      },
    ]);

    const coffeeCat = categories.find((c) => c.name === "Coffee")?._id;
    const pastryCat = categories.find((c) => c.name === "Pastry")?._id;
    const nonCoffeeCat = categories.find((c) => c.name === "Non-Coffee")?._id;

    const sizeMod = modifiers.find((m) => m.groupName === "Size")?._id;
    const sweetMod = modifiers.find((m) => m.groupName === "Sweetness")?._id;
    const milkMod = modifiers.find((m) => m.groupName === "Milk Type")?._id;

    logger.info("Seeding Items...");
    const items = await ItemModel.insertMany([
      {
        categoryId: coffeeCat,
        name: "Caffe Latte",
        price: 25000,
        imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c170da6d?auto=format&fit=crop&w=800&q=80",
        isAvailable: true,
        modifier: [sizeMod, sweetMod, milkMod],
        addon: [
          { name: "Extra Shot Espresso", price: 7000 },
          { name: "Caramel Syrup", price: 5000 },
        ],
      },
      {
        categoryId: coffeeCat,
        name: "Americano",
        price: 20000,
        imageUrl: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80",
        isAvailable: true,
        modifier: [sizeMod, sweetMod],
        addon: [{ name: "Extra Shot Espresso", price: 7000 }],
      },
      {
        categoryId: nonCoffeeCat,
        name: "Matcha Latte",
        price: 28000,
        imageUrl: "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?auto=format&fit=crop&w=800&q=80",
        isAvailable: true,
        modifier: [sizeMod, sweetMod, milkMod],
        addon: [{ name: "Extra Matcha Powder", price: 6000 }],
      },
      {
        categoryId: pastryCat,
        name: "Butter Croissant",
        price: 18000,
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        isAvailable: true,
        modifier: [],
        addon: [
          { name: "Strawberry Jam", price: 4000 },
          { name: "Butter", price: 3000 },
        ],
      },
      {
        categoryId: pastryCat,
        name: "Choco Muffin",
        price: 22000,
        imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80",
        isAvailable: true,
        modifier: [],
        addon: [],
      },
    ]);

    logger.info("Seeding Discounts...");
    const discounts = await DiscountModel.insertMany([
      {
        code: "WELCOME10",
        name: "Welcome Discount 10K",
        value: 10000,
        minTransaction: 50000,
        limitUsage: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      },
      {
        code: "COFFEE5",
        name: "Coffee Lover 5K",
        value: 5000,
        minTransaction: 30000,
        limitUsage: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      }
    ]);

    logger.info("Seeding Transactions...");
    const dummyTransactions = [];
    
    for (let i = 0; i < 50; i++) {
      // random date within last 30 days
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      const invoiceNumber = `INV-${createdAt.getTime()}-${Math.floor(Math.random() * 1000)}`;
      
      // select 1-3 random items
      const numItems = Math.floor(Math.random() * 3) + 1;
      const tItems = [];
      let subtotal = 0;
      
      for (let j = 0; j < numItems; j++) {
        const item = items[Math.floor(Math.random() * items.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        const price = item.price;
        const itemSubtotal = price * qty;
        
        subtotal += itemSubtotal;
        
        tItems.push({
          itemId: item._id,
          price: price,
          quantity: qty,
          subtotal: itemSubtotal,
          addon: [],
          mod: [],
          notes: "",
        });
      }
      
      // select discount randomly 20% of the time
      let discountObj = null;
      let discountAmount = 0;
      if (Math.random() < 0.2) {
        const discount = discounts[Math.floor(Math.random() * discounts.length)];
        if (subtotal >= discount.minTransaction) {
          discountObj = {
            discountId: discount._id,
            code: discount.code,
            name: discount.name,
            value: discount.value,
          };
          discountAmount = discount.value;
        }
      }
      
      const tax = (subtotal - discountAmount) * 0.12;
      const total = Math.max(0, subtotal - discountAmount + tax);
      
      dummyTransactions.push({
        invoiceNumber,
        cashier: user._id,
        type: Math.random() > 0.5 ? transactionType.DINE_IN : transactionType.TAKE_AWAY,
        items: tItems,
        totalItems: tItems.reduce((acc, it) => acc + it.quantity, 0),
        paymentMethod: Math.random() > 0.5 ? paymentMethod.CASH : paymentMethod.QRIS,
        amountPaid: total,
        changeAmount: 0,
        subtotal,
        tax,
        discount: discountObj,
        status: transactionStatus.PAID,
        total,
        createdAt,
        updatedAt: createdAt,
      });
    }

    await TransactionsModel.insertMany(dummyTransactions);
    
    logger.info(`Successfully seeded Master Data with 50 Dummy Transactions!`);
    process.exit(0);
  } catch (error) {
    logger.error(error, "Failed to seed Dummy Data");
    process.exit(1);
  }
};

seedDummyData();
