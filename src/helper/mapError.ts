import { FieldError } from "../generated/graphql";

export const mapError = (errors: FieldError[]): { [key: string]: any } => {
  return errors.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.field]: cur.message,
    };
  }, {});
};
