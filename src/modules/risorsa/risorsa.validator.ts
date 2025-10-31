import Joi from 'joi';

export const validateRisorsa = (data: any) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.base': 'Il name deve essere una stringa.',
                'string.empty': 'Il name è obbligatorio.',
                'string.min': 'Il name deve contenere almeno 2 caratteri.',
                'any.required': 'Il name della risorsa è obbligatorio.',
            }),
    });

    return schema.validate(data);
};