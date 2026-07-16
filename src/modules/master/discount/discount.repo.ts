import DicsountModel from "../../../database/schema/Discount/DiscountModel";
import { BaseRepository } from "../../../database/BaseRepository";

export class DiscountRepo extends BaseRepository<any, any> {
  constructor() {
    super(DicsountModel as any);
  }
}
