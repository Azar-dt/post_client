import { FieldError } from "../../../server/src/types/FieldError";

export const mapError = (errors: FieldError[]): { [key: string]: any } => {
  return errors.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.field]: cur.message,
    };
  }, {});
};
