import { QueryOptions } from "../../../database/BaseRepository";
import { ModifierRepo } from "./modifier.repo";
import {
  IModifierCreate,
  IModifierDocument,
  IModifierUpdate,
} from "./modifier.types";

export class ModifierService {
  constructor(private readonly repo: ModifierRepo) {}

  async getAllModifiers(options: QueryOptions<IModifierDocument> = {}) {
    return await this.repo.findAll(options);
  }

  async getModifierById(id: string) {
    return await this.repo.findById(id);
  }

  async createModifier(payload: IModifierCreate) {
    return await this.repo.create(payload);
  }

  async updateModifier(id: string, payload: IModifierUpdate) {
    return await this.repo.update(id, payload);
  }

  async deleteModifier(id: string) {
    return await this.repo.delete(id);
  }
}
