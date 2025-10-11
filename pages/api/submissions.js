// @ts-ignore
import Page from "../../models/page";
import dbConnect from "../../utils/dbConnect";

const nodemailer = require("nodemailer");

export default async function check(req, res) {
  return res.status(200).json({ ok: true });
}

async function checkAlt(req, res) {
  await dbConnect();

  const { name, submission, mailTo, formName } = req.body;

  // sanitize user input for normal search shit, limit
  // maybe slugify

  // spamm control, throttles, etc..

  try {
    const page = await Page.findOne({ $or: [{ name }, { draftId: name }] });

    if (page) {
      console.log(submission, page.submissions);
      page.submissions.push({ data: submission, formName });
      await page.save();

      if (mailTo) {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_SERVER,
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        let emailContent = "New submission:\n\n";

        for (const key in submission) {
          emailContent += `${key}: ${submission[key]}\n`;
        }

        // setup email data
        const mailOptions = {
          from: "Pagehub <no-reply@pagehub.dev>",
          to: mailTo,
          subject: `You have received a submission for ${page.domain || name || page.draftId}`,
          text: emailContent,
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      }

      return res.status(200).json({ ok: true });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }

  res.status(200).json({ fail: true });
}
