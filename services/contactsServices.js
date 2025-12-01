import Contact from "../models/Contact.js";

async function listContacts() {
  return Contact.findAll();
}

async function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (contact) {
    await contact.destroy();
  }
  return contact;
}

async function addContact(name, email, phone, favorite) {
  return Contact.create({ name, email, phone, favorite });
}

async function updateContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
  if (contact) {
    await contact.update(body);
  }
  return contact;
}

async function updateStatusContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
  if (contact) {
    await contact.update(body);
  }
  return contact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
