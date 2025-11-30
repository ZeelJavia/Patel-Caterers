const ContactForm = require("../models/ContactForm");
const nodemailer = require("nodemailer");

// Get all contact form submissions
const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactForm.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single contact by ID
const getContactById = async (req, res) => {
  try {
    const contact = await ContactForm.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new contact form submission
const createContact = async (req, res) => {
  try {
    const contact = new ContactForm(req.body);
    await contact.save();

    // Configure email transporter
    // NOTE: For Gmail, you need to use an App Password if 2FA is enabled.
    // It's recommended to store these credentials in your .env file.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zeeljavia123@gmail.com",
        pass: "ghvf ssjy mwzu llqe",
      },
    });

    const mailOptions = {
      from: '"Patel Caterers Website" <no-reply@patelcaterers.com>',
      to: "zeeljavia123@gmail.com",
      subject: `New Catering Inquiry: ${contact.eventType} - ${contact.name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #d97706; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Catering Inquiry</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              You have received a new inquiry from the website contact form. Here are the details:
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: bold; width: 140px;">Name:</td>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${
                  contact.name
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${
                  contact.email
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${
                  contact.phone
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: bold;">Event Type:</td>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${
                  contact.eventType
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: bold;">Event Date:</td>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${new Date(
                  contact.eventDate
                ).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: bold;">Guest Count:</td>
                <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${
                  contact.guestCount
                }</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <p style="color: #6b7280; font-weight: bold; margin-bottom: 10px;">Message:</p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #374151; line-height: 1.6; border: 1px solid #e5e7eb;">
                ${contact.message.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">This email was sent automatically from the Patel Caterers website.</p>
          </div>
        </div>
      `,
    };

    // Attempt to send email
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to zeeljavia123@gmail.com");
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // We continue even if email fails, as the contact is saved
    }

    res.status(201).json({
      message: "Contact form submitted successfully",
      contact,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update contact status/response
const updateContact = async (req, res) => {
  try {
    const contact = await ContactForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete contact
const deleteContact = async (req, res) => {
  try {
    const contact = await ContactForm.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
