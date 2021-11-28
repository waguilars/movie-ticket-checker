import twilio from "twilio";
import { MovieDetail } from "./interfaces";

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSID, authToken);

export const createMessage = (movie: MovieDetail) => {
  const { title, location, link, shows } = movie;

  let message = `${title} is now available in ${location}.\n`;

  shows.forEach(({ title, availableSchedules }) => {
    message += `*${title}:* |${availableSchedules.join("|")}|\n`;
  });

  message += `More info: ${link}`;
  return message;
};

export const sendMessage = (message: string, number: string) => {
  return client.messages.create({
    from: "whatsapp:+14155238886",
    body: message,
    to: `whatsapp:${number}`,
  });
};
