import Contact from "../models/Contact.js";

async function listContacts(ownerId) {
  return Contact.findAll({ where: { owner: ownerId } });
}

async function getContactById(contactId, ownerId) {
  return Contact.findOne({ where: { id: contactId, owner: ownerId } });
}

async function removeContact(contactId, ownerId) {
  const contact = await getContactById(contactId, ownerId);
  if (contact) {
    await contact.destroy();
  }
  return contact;
}

async function addContact(name, email, phone, favorite, ownerId) {
  return Contact.create({ name, email, phone, favorite, owner: ownerId });
}

async function updateContact(contactId, body, ownerId) {
  const contact = await getContactById(contactId, ownerId);
  if (contact) {
    await contact.update(body);
  }
  return contact;
}

async function updateStatusContact(contactId, body, ownerId) {
  const contact = await getContactById(contactId, ownerId);
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
