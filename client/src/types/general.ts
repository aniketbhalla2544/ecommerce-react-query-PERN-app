export type FieldsObject<ObjectType extends object, T2 = string> = {
  [Key in keyof ObjectType]: T2;
};

export type UknownObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
};
