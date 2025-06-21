import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEnquiryEmail = async (item: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Enquiry for Item: ${item.name}`,
    html: `
      <h2>New Item Enquiry</h2>
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; max-width: 600px;">
        <h3>Item Details:</h3>
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Enquiry Date:</strong> ${new Date().toLocaleString()}</p>
        
        <h4>Cover Image:</h4>
        <img src="${item.coverImage}" alt="${item.name}" style="max-width: 300px; height: auto; border-radius: 4px;">
        
        ${item.images.length > 0 ? `
          <h4>Additional Images:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${item.images.map((img: string) => `
              <img src="${img}" alt="${item.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 4px;">
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <p style="margin-top: 20px; color: #666;">
        This enquiry was generated automatically from the Item Management System.
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Enquiry email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};