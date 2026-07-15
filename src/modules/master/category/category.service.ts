import { QueryOptions } from "../../../database/BaseRepository";
import { CategoryRepo } from "./category.repo";
import {
  ICategoryCreate,
  ICategoryDocument,
  ICategoryUpdate,
} from "./category.types";

export class CategoryService {
  constructor(private readonly repo: CategoryRepo) {}

  async getAllCategories(options: QueryOptions<ICategoryDocument> = {}) {
    return await this.repo.findAll(options);
  }

  async getCategoryById(id: string) {
    return await this.repo.findById(id);
  }

  async createCategory(payload: ICategoryCreate) {
    return await this.repo.create(payload);
  }

  async updateCategory(id: string, payload: ICategoryUpdate) {
    return await this.repo.update(id, payload);
  }

  async deleteCategory(id: string) {
    return await this.repo.delete(id);
  }
}
