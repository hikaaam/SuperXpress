import * as Crypto from "crypto-js";
import * as joi from "joi";
import { getRepository, EntitySchema } from "typeorm";
import { User } from "../../entity/User";
import resp from "../Response";

export const hash = (plaintext: string): string => {
  return Crypto.SHA256(plaintext).toString();
};

export const encrypt = (plaintext: string, key: string): string => {
  return Crypto.AES.encrypt(plaintext, key).toString();
};

export const decrypt = (encrypted: string, key: string): string => {
  return Crypto.AES.decrypt(encrypted, key).toString(Crypto.enc.Utf8);
};

export const ID = joi.object({
  id: joi.number().min(1),
});

export const validate = (schema: joi.ObjectSchema, obj: object) => {
  const { error } = schema.validate(obj);
  if (error) {
    throw new Error(error.message);
  }
};

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const passwordJoi = joi.object({
  password: joi
    .string()
    .pattern(passwordRegex)
    .required()
    .label("password")
    .messages({
      "string.pattern.base":
        "password must have at least 8 characters and a number",
    }),
});

interface paginatorRequest {
  page: number;
  get: number;
  entity: any;
  options?: {
    select?: string[];
    where?: {};
    order?: {};
    relation?: string[];
    withDeleted?: boolean;
    join?: {
      alias: string;
      innerJoin?: {};
      leftJoin?: {};
      innerJoinAndSelect: {};
      leftJoinAndSelect: {};
    };
    cache?: boolean;
  };
}
export const paginator = async (obj: paginatorRequest) => {
  const { page, get, entity, options } = obj;
  const total: number = await getRepository(entity).count({
    ...options,
  });
  let mod: number = total % get != 0 ? 1 : 0;
  let totalPage: number = Math.floor(total / get) + mod;
  let currentPage: number = page >= totalPage ? totalPage : page;
  let nextPage: number = page >= totalPage ? null : page + 1;
  let prevPage: number = page <= 1 ? null : page - 1;
  let skip: number = get * page - get;
  let take: number = get * page;
  const data = await getRepository(entity).find({
    skip,
    take,
    ...options,
  });
  let paginatorInfo = {
    data,
    currentPage,
    nextPage,
    prevPage,
    totalPage,
    count: total,
  };
  return paginatorInfo;
};
