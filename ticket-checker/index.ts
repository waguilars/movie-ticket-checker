import { AzureFunction, Context } from "@azure/functions";
import { checkMovie } from './scrapper';

// const MY_MOVIE = process.env.MOVIE || "spider-man";
const MY_MOVIE = process.env.MOVIE || "encanto";

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  const timeStamp = new Date().toISOString();

  const movieDetails = await checkMovie(MY_MOVIE);
  console.log(movieDetails);
  context.log('Timer is running...');
};

export default timerTrigger;
