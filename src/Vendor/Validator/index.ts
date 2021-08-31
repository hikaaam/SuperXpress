import * as joi from 'joi';

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const joiPassword = joi.object({
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

export const joiID = joi.object({
    id: joi.number().min(1),
});

export const validate = (schema: joi.ObjectSchema, obj: object) => {
    const { error } = schema.validate(obj);
    if (error) {
        throw new Error(error.message);
    }
};


export default {
    passwordRegex,
    joiID,
    joiPassword,
    validate
}