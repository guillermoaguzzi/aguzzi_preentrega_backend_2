const Joi = require('joi')


// "(...) Todos los campos son obligatorios, a excepción de thumbnails (...)"  (consignas.txt:20)
const postSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.boolean().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
	thumbnails: Joi.array().items(Joi.string()),
});

const putSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    code: Joi.string(),
    price: Joi.number(),
    status: Joi.boolean(),
    stock: Joi.number(),
    category: Joi.string(),
	thumbnails: Joi.array().items(Joi.string()),
});

module.exports = {
    postSchema: postSchema,
    putSchema: putSchema
};