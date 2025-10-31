import Joi from 'joi';

export const validateRichiesta = (data: any) => {
    const schema = Joi.object({
        titolo: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Il titolo deve avere almeno 3 caratteri.',
            'any.required': 'Il titolo è obbligatorio.',
        }),
        motivazione: Joi.string().min(5).required().messages({
            'any.required': 'La motivazione è obbligatoria.',
        }),
        dataInizio: Joi.date()
        .required()
        .messages({
            'any.required': 'La data di inizio è obbligatoria.',
        }),
        dataFine: Joi.date()
        .required()
        .greater(Joi.ref('dataInizio'))
        .messages({
            'date.greater': 'La data di fine deve essere successiva alla data di inizio.',
        }),
        calendarioId: Joi.string().guid({ version: 'uuidv4' }).required(),
        userId: Joi.string().guid({ version: 'uuidv4' }).required(),
    });

    return schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });
};

export const validateRichiestaDecision = (data: any) => {
    const schema = Joi.object({
        stato: Joi.string()
            .valid('approved', 'rejected')
            .required()
            .messages({
                'any.only': 'Lo stato deve essere "approved" o "rejected".',
                'any.required': 'Lo stato è obbligatorio.',
            }),

        motivazione: Joi.alternatives()
            .conditional('stato', {
                is: 'rejected',
                then: Joi.string().min(5).required(),
                otherwise: Joi.forbidden()
            })
            .messages({
                'any.required': 'La motivazione è obbligatoria quando la richiesta è rifiutata.',
                'string.min': 'La motivazione deve contenere almeno 5 caratteri.',
            })
    });

    return schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });
};

export const validateFiltroRichieste = (data: any) => {
    const schema = Joi.object({
        calendarioId: Joi.string().uuid().optional(),
        stato: Joi.string().valid("pending", "approved", "rejected", "invalid").optional(),
        dataInizio: Joi.date().optional(),
        dataFine: Joi.date().optional(),
    });

    return schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });
};
