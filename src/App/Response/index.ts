import { response } from "express";
export interface IRes {
  success: boolean;
  msg: string;
  data: any
}
const resp = (scs: boolean, msg: string, data: any): IRes => {
  // data = data ?? [];
  if (scs) {
    return {
      success: true,
      msg,
      data,
    };
  }
  return {
    success: false,
    msg,
    data,
  };
};
export const Err = (msg: string, data: any = []) => {
  return resp(false, msg, data);
};
export default resp;
