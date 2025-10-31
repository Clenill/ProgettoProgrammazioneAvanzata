import Joi from "joi";

export const validateAddToken = (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().guid({ version: "uuidv4" }).required(),
        token: Joi.number().integer().min(1).required()
            .messages({
                "number.min": "I token da aggiungere devono essere almeno 1"
            }),
    });

    return schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });
};