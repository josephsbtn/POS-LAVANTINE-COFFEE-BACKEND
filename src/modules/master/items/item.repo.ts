import { BaseRepository } from "../../../database/BaseRepository";
import ItemModel from "../../../database/schema/Items/ItemModel";
import { IItemDocument, IItemCreate } from "./item.types";

export class ItemRepo extends BaseRepository<
  IItemDocument,
  IItemCreate
> {
  constructor() {
    super(ItemModel as any);
  }
}
