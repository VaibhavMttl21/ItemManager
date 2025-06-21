"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEnquiryEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEnquiryEmail = (item) => __awaiter(void 0, void 0, void 0, function* () {
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
            ${item.images.map((img) => `
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
        yield transporter.sendMail(mailOptions);
        console.log('Enquiry email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.sendEnquiryEmail = sendEnquiryEmail;
