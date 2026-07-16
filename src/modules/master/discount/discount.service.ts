import { DiscountRepo } from "./discount.repo";

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
}
