const Contact = require('../models/Contact')
const nodemailer = require('nodemailer')

exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, service, location, size, message } = req.body

    // Validate required fields
    if (!firstName || !lastName || !phone || !service || !location) {
      return res.status(400).json({ error: 'Please fill in all required fields.' })
    }

    // Save to MongoDB
    const contact = await Contact.create({
      firstName, lastName, phone, email,
      service, location, size, message
    })

    // Send notification email (if configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      })

      await transporter.sendMail({
        from: `"ITWORKS Website" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `New Quote Request — ${service} — ${firstName} ${lastName}`,
        html: `
          <h2>New Quote Request from itworks.co.ke</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email || 'Not provided'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Service</strong></td><td style="padding:8px;border:1px solid #ddd">${service}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Location</strong></td><td style="padding:8px;border:1px solid #ddd">${location}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Property Size</strong></td><td style="padding:8px;border:1px solid #ddd">${size || 'Not specified'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${message || 'No message'}</td></tr>
          </table>
          <p style="margin-top:16px;color:#666">Submitted: ${new Date().toLocaleString('en-KE', {timeZone:'Africa/Nairobi'})}</p>
        `
      })
    }

    res.status(201).json({ success: true, id: contact._id })

  } catch (err) {
    console.error('Contact submit error:', err)
    res.status(500).json({ error: 'Server error. Please try again or WhatsApp us directly.' })
  }
}

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts.' })
  }
}

exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!contact) return res.status(404).json({ error: 'Contact not found.' })
    res.json(contact)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact.' })
  }
}
