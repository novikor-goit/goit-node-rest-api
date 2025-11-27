import express from "express";
import actions from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", actions.getAllContacts);

contactsRouter.get("/:id", actions.getOneContact);

contactsRouter.delete("/:id", actions.deleteContact);

contactsRouter.post("/", actions.createContact);

contactsRouter.put("/:id", actions.updateContact);

export default contactsRouter;
