import { BaseRepository } from "../../../database/BaseRepository";
import CategoryModel from "../../../database/schema/Items/CategoryModel";
import { ICategoryDocument, ICategoryCreate } from "./category.types";

export class CategoryRepo extends BaseRepository<
  ICategoryDocument,
  ICategoryCreate
> {
  constructor() {
    super(CategoryModel as any);
  }
}
