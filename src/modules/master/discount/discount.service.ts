import { DiscountRepo } from "./discount.repo";
import { AppError } from "../../../utils/AppError";

export class DiscountService {
  constructor(private readonly repo: DiscountRepo) {}

  async getAllDiscounts() {
    return await this.repo.findAll();
  }

  async getDiscountById(id: string) {
    return await this.repo.findById(id);
  }

  async createDiscount(data: any) {
    return await this.repo.create(data);
  }

  async updateDiscount(id: string, data: any) {
    return await this.repo.update(id, data);
  }

  async deleteDiscount(id: string) {
    return await this.repo.delete(id);
  }

  async validateDiscount(code: string, subtotal: number) {
    const discount = await this.repo.findOne({ filter: { code } });
    if (!discount) {
      throw AppError.notFound("Discount not found");
    }
    
    if (discount.minTransaction && subtotal < discount.minTransaction) {
      throw AppError.badRequest(`Minimum transaction is ${discount.minTransaction}`);
    }

    if (discount.startDate && new Date() < new Date(discount.startDate)) {
      throw AppError.badRequest("Discount is not yet active");
    }

    if (discount.endDate && new Date() > new Date(discount.endDate)) {
      throw AppError.badRequest("Discount is expired");
    }

    return discount;
  }
}

