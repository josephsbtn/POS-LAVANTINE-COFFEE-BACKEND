import { BaseRepository } from "../../../database/BaseRepository";
import ModModel from "../../../database/schema/Items/ModifierModel";
import { IModifierDocument, IModifierCreate } from "./modifier.types";

export class ModifierRepo extends BaseRepository<
  IModifierDocument,
  IModifierCreate
> {
  constructor() {
    super(ModModel as any);
  }
}
