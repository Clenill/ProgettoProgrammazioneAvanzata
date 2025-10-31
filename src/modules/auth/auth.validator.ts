import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateSignUp = (userData: any) => {
    const schema = Joi.object({
        id: Joi.string()
            .guid({ version: 'uuidv4' })
            .optional()
            .messages({ 'string.guid': 'User ID must be in UUID format' }),
        email: Joi.string()
        .email().
        required().
        messages({
            'string.email': 'Formato email non valido',
            'any.required': 'Email obbligatoria',
        }),
        username: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Username deve avere almeno 3 caratteri.',
        }),
        role: Joi.string()
        .valid('utente', 'admin')
        .optional()
        .messages({
            'any.only': 'Ruolo non valido. Può essere solo "utente" o "admin".',
        }),
    });

    return schema.validate(userData, options);
};

export const validateSignIn = (userData: any) => {
    const schema = Joi.object({
        email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Formato email non valido',
            'any.required': 'Email obbligatoria',
        }),
    });

    return schema.validate(userData, options);
};