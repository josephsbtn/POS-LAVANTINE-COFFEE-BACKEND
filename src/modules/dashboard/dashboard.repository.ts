import { BaseRepository } from "../../database/BaseRepository";
import TransactionsModel, { TypeTransactionSchema } from "../../database/schema/Transaction/TransactionModel";

export class DashboardRepository extends BaseRepository<TypeTransactionSchema, any> {
  constructor() {
    super(TransactionsModel as any);
  }

  async aggregate(pipeline: any[]): Promise<any> {
    return await this.model.aggregate(pipeline).exec();
  }
}
