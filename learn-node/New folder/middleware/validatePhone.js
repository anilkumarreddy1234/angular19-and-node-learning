const validatePhone = (req, res, next) => {
    const { phone } = req.body;
    const phoneRegex = /^\+\d{10,15}$/; // E.g., +12345678901

    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number. Use format: +12345678901' });
    }

    req.phone = phone; // Sanitized phone number
    next();
};

module.exports = validatePhone;