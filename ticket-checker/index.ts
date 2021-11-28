import { AzureFunction, Context } from "@azure/functions";
import { createMessage, sendMessage } from "./notification";
import { checkMovie } from "./scrapper";

const MY_MOVIE = process.env.MOVIE;

const TO_SEND = ["+593987014414", "+593984757042"];

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  if (!MY_MOVIE) {
    return context.log("Movie name is not defined");
  }

  const movieDetails = await checkMovie(MY_MOVIE);
  console.log(movieDetails);
  context.log("Timer is running...");

  const message = createMessage(movieDetails);
  context.log("Creating message...");
  context.log(message);

  for (const number of TO_SEND) {
    context.log(`Sending message to ${number}`);
    await sendMessage(message, number);
  }
};

export default timerTrigger;
