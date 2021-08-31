import * as joi from 'joi'

const paginator = joi.object({
  page: joi.number().min(1).required(),
});

export interface page {
  page: number;
}

export default paginator;
