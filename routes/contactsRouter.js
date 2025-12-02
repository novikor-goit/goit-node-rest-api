import express from "express";
import actions from "../controllers/contactsControllers.js";
import authenticate from "../helpers/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, actions.getAllContacts);
contactsRouter.get("/:id", authenticate, actions.getOneContact);
contactsRouter.delete("/:id", authenticate, actions.deleteContact);
contactsRouter.post("/", authenticate, actions.createContact);
contactsRouter.put("/:id", authenticate, actions.updateContact);
contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  actions.updateStatusContact
);

export default contactsRouter;
