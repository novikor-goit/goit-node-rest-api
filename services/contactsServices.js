import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function persist(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) ?? null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await persist(contacts);
    return result;
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {id: crypto.randomUUID(), name, email, phone};
    contacts.push(newContact);
    await persist(contacts);
    return newContact;
}

async function updateContact(contactId, body) {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = {...contacts[index], ...body};
    await persist(contacts);
    return contacts[index];
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};