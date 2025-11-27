import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import {createContactSchema, updateContactSchema,} from "../schemas/contactsSchemas.js";

const errorHandlingWrapper = (ctrl) => {
    return async (req, res, next) => {
        try {
            await ctrl(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

async function getAllContacts(req, res) {
    const result = await contactsService.listContacts();
    res.json(result);
}

async function getOneContact(req, res) {
    const {id} = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
}

async function deleteContact(req, res) {
    const {id} = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
}

async function createContact(req, res) {
    const {name, email, phone} = req.body;
    const result = await contactsService.addContact(name, email, phone);
    res.status(201).json(result);
}

async function updateContact(req, res) {
    const {id} = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
}

const actions = {
    getAllContacts: errorHandlingWrapper(getAllContacts),
    getOneContact: errorHandlingWrapper(getOneContact),
    deleteContact: errorHandlingWrapper(deleteContact),
    createContact: [validateBody(createContactSchema), errorHandlingWrapper(createContact)],
    updateContact: [validateBody(updateContactSchema), errorHandlingWrapper(updateContact)],
};

export default actions;