import { Context } from '@azure/functions';
import { chromium, Page } from "playwright";

// const MY_MOVIE = process.env.MOVIE || "encanto";


type debug = Context | Console;

export const checkMovie = async (movieName: string) => {
  const browser = await chromium.launch({ headless: true });
  // Create pages, interact with UI elements, assert values
  const page = await browser.newPage();

  await page.goto("https://www.supercines.com/cartelera/quito/san-luis/216", {
    waitUntil: "networkidle",
  });

  const moviePage = await searchMovie(movieName, page);

  await moviePage.click({ force: true });

  const details = await getMovieDetails(page);

  await browser.close();

  return details;
};

const searchMovie = async (movieName: string, page: Page, context: debug = console) => {
  const cinemaMovies = await page.$$("#cartelera .peliculaTitulo");

  for (const movie of cinemaMovies) {
    const movieTitle = await movie.textContent();

    if (movieTitle.toLowerCase().includes(movieName)) {
      context.log(`Movie founded: ${movieTitle}, going to details...`);
      return movie;
    }
  }

  throw new Error(`The Movie: ${movieName} not found!`);
};

const getMovieDetails = async (page: Page) => {
  const location = await page.textContent(".tituloComplexHorario");
  const options = await page.$$(".col-xs-12.col-sm-6");
  const link = page.url();

  const shows = [];

  for (const opt of options) {
    const titleEl = await opt.$(".horarioTitulo");
    const title = await titleEl.textContent();

    const schedules = await opt.$$('[class="HourSchedule HourSchedule"]');

    const availableSchedules = (
      await Promise.all(schedules.map((schedule) => schedule.textContent()))
    ).map((time) => time.trim());

    shows.push({ title, availableSchedules });
  }

  return { location, link, shows };
};

