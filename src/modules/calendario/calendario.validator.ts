import Joi from 'joi';

export const validateCalendario = (data: any) => {
    const schema = Joi.object({
        risorsaId: Joi.string()
            .guid( { version: 'uuidv4' })
            .required()
            .messages({
                'string.guid': 'ID risorsa non valido (UUID richiesto).',
                'any.required': 'Il campo risorsaId è obbligatorio.',
            }),
        tokenCostoOrario: Joi.number()
            .integer()
            .min(1)
            .required()
            .messages({
                'number.base': 'Il costo orario deve essere un numero intero.',
                'any.required': 'Il costo orario è obbligatorio.',
                'number.min': 'Il costo orario deve essere almeno 1 token/ora',
            }),
    });
    return schema.validate(data);
};

export const validateDisponibilitaCalendario = (data: any) => {
    const schema = Joi.object({
        calendarioId: Joi.string()
            .guid({ version: 'uuidv4' })
            .required()
            .messages({
                "string.guid": "calendarioId non valido.",
                "any.required": "calendarioId è obbligatorio."
            }),

        dataInizio: Joi.date()
            .required()
            .messages({
                "any.required": "dataInizio è obbligatoria."
            }),

        dataFine: Joi.date()
            .greater(Joi.ref('dataInizio'))
            .required()
            .messages({
                "any.required": "dataFine è obbligatoria.",
                "date.greater": "dataFine deve essere successiva a dataInizio."
            })
    });

    return schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });
};