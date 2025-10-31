import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// This is the object that knows HOW to send an email
const transporter = nodemailer.createTransport({
  service: 'gmail', // We are using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @desc    Sends a notification email to all representatives
 * @param   {string[]} emailList - An array of email addresses
 * @param   {string} winner - The name of the winning country
 */
export const sendTournamentCompleteEmail = async (emailList, winner) => {
  const mailOptions = {
    from: `"African Nations League" <${process.env.EMAIL_USER}>`,
    to: emailList.join(', '), // Joins all emails with a comma
    subject: 'Tournament Results: A Winner is Crowned!',
    
    // The plain text version of the email
    text: `
      Hello Federation Representatives,

      The 2026 African Nations League tournament simulation is complete!
      
      We are thrilled to announce that the winner is: ${winner}

      Please log in to the platform to view the full tournament bracket, top goalscorers, and the official summary.

      Thank you for your participation.
    `,
    
    // The HTML version of the email
    html: `
      <p>Hello Federation Representatives,</p>
      <p>The 2026 African Nations League tournament simulation is complete!</p>
      <p>We are thrilled to announce that the winner is: <b>${winner}</b></p>
      <p>Please log in to the platform to view the full tournament bracket, top goalscorers, and the official summary.</p>
      <p>Thank you for your participation.</p>
    `,
  };

  try {
    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Tournament email sent to: ${emailList.join(', ')}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // We only log the error; we do not throw it further
  }
};