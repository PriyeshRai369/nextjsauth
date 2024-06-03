import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry:new Date(Date.now() + 3600000),
        }
      });
    }else if(emailType === "RESET"){
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        }
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "00b111f778a554",
        pass: "ca89cc42a261e5",
      },
    });

    const mailOptions = {
      from: "priyesh@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `<a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}"><p> Click here to ${
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Email"
      }  </p></a>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
