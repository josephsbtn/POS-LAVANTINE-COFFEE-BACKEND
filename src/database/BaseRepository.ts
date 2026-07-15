import {
  Model,
  QueryFilter,
  UpdateQuery,
  Error as MongooseError,
  ProjectionType,
  PopulateOptions,
  SortOrder,
} from "mongoose";
import { AppError } from "../utils/AppError";

export interface QueryOptions<T> {
  filter?: QueryFilter<T>;
  projection?: ProjectionType<T>;
  populate?: PopulateOptions | PopulateOptions[];
  sort?: SortOrder;
  page?: number;
  limit?: number;
  lean?: boolean;
}

export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export abstract class BaseRepository<
  TDocument,
  TCreateDto,
  TUpdateDto = Partial<TCreateDto>,
> {
  constructor(protected readonly model: Model<TDocument>) {}

  protected handleError(error: any): never {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof MongooseError.ValidationError) {
      throw AppError.validation(error.message);
    }

    if (error instanceof MongooseError.CastError) {
      throw AppError.badRequest(`Invalid ${error.path}: ${error.value}`);
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      throw AppError.conflict(`Duplicate value for field: ${field}`);
    }

    throw AppError.internal("Database operation failed");
  }

  async create(payload: TCreateDto): Promise<TDocument> {
    try {
      const doc = await this.model.create(payload as any);
      return doc as unknown as TDocument;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(
    id: string,
    options?: Omit<
      QueryOptions<TDocument>,
      "filter" | "page" | "limit" | "sort"
    >,
  ): Promise<TDocument | null> {
    try {
      let query = this.model.findById(id);

      if (options?.projection) query = query.select(options.projection);
      if (options?.populate) query = query.populate(options.populate as any);
      if (options?.lean) query = query.lean() as any;

      return (await query.exec()) as TDocument | null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(options: QueryOptions<TDocument>): Promise<TDocument | null> {
    try {
      let query = this.model.findOne(options.filter || {});

      if (options.projection) query = query.select(options.projection);
      if (options.populate) query = query.populate(options.populate as any);
      if (options.sort) query = query.sort(options.sort as any);
      if (options.lean) query = query.lean() as any;

      return (await query.exec()) as TDocument | null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(
    options: QueryOptions<TDocument> = {},
  ): Promise<PaginationResult<TDocument>> {
    try {
      const { filter = {}, page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      let query = this.model.find(filter);

      if (options.projection) query = query.select(options.projection);
      if (options.populate) query = query.populate(options.populate as any);
      if (options.sort) query = query.sort(options.sort as any);
      if (options.lean) query = query.lean() as any;

      query = query.skip(skip).limit(limit);

      const [data, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(filter).exec(),
      ]);

      return {
        data: data as unknown as TDocument[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, payload: TUpdateDto): Promise<TDocument | null> {
    try {
      const result = await this.model
        .findByIdAndUpdate(id, payload as unknown as UpdateQuery<TDocument>, {
          new: true,
          runValidators: true,
        })
        .exec();
      return result as unknown as TDocument | null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async exists(filter: QueryFilter<TDocument>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter).exec();
      return result !== null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async count(filter: QueryFilter<TDocument> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      this.handleError(error);
    }
  }
}
