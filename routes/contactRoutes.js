// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const Joi = require('joi');

// Validation schema
const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().optional()
});

// GET /contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /contacts
router.post('/', async (req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const contact = new Contact(req.body);
    try {
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /contacts/:id
router.put('/:id', async (req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /contacts/:id
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /contacts/:id
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Bonus: Search Contacts
router.get('/search', async (req, res) => {
    const { name, email } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    if (email) query.email = { $regex: email, $options: 'i' };

    try {
        const contacts = await Contact.find(query);
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;