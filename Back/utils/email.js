const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Quiz App',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 15px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #2563eb; display: inline-block; padding: 15px; border-radius: 50%;">
              <span style="font-size: 40px; color: white;">&#x1F4DD;</span>
            </div>
          </div>
          <h2 style="color: #1e293b; text-align: center; font-size: 24px; margin-bottom: 20px;">Quiz App Verification</h2>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #475569; text-align: center; margin-bottom: 15px;">Here's your verification code:</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #2563eb; font-family: monospace;">${otp}</div>
            <p style="color: #64748b; text-align: center; margin-top: 20px; font-size: 14px;">This code will expire in 15 minutes</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 13px;">If you didn't request this code, please ignore this email.</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px;">© ${new Date().getFullYear()} Quiz App. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send OTP email');
  }
};

exports.sendVerificationEmail = async (email, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Quiz App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 15px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #2563eb; display: inline-block; padding: 15px; border-radius: 50%;">
              <span style="font-size: 40px; color: white;">&#x2709;</span>
            </div>
          </div>
          <h2 style="color: #1e293b; text-align: center; font-size: 24px; margin-bottom: 20px;">Verify Your Email Address</h2>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #475569; text-align: center; margin-bottom: 25px;">Click the button below to verify your email address:</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Verify Email</a>
            </div>
            <p style="color: #64748b; text-align: center; margin-top: 25px; font-size: 14px;">This link will expire in 1 hour</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 13px;">If you didn't create an account, please ignore this email.</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px;">© ${new Date().getFullYear()} Quiz App. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};