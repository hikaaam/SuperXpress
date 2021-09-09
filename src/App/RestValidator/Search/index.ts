import * as joi from 'joi'
const search = joi.object({
  search: joi.string().min(1).required(),
});

export interface Isearch {
  Isearch: string;
}

export default search;
