import { mkdirSync, rmSync } from "node:fs";
import { v2 as cloudinary } from "cloudinary";
import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const gridSize = 10;

const destination = "./salen";

const page = await browser.newPage();

await page.goto("http://localhost:3000/salen");
await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 1.5 });
await page.waitForSelector("img");

const map = await page.$("#touchzone");
const { x, y, width, height } = await map.boundingBox();

const columns = Math.floor(width / gridSize);
const rows = Math.floor(height / gridSize);
const total = (columns + 1) * (rows + 1);

let generated = 0;

const drawProgressBar = (current, goal) => {
  const percentage = Math.floor((current / goal) * 100);
  const barWidth = 30;
  const filledWidth = Math.floor((percentage / 100) * barWidth);
  const emptyWidth = barWidth - filledWidth;
  const progressBar = "█".repeat(filledWidth) + "▒".repeat(emptyWidth);
  return `[${progressBar}] ${current}/${goal} ${percentage}%`;
};

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

for (let row = 0; row <= rows; row++) {
  for (let col = 0; col <= columns; col++) {
    const xPos = x + col * gridSize + gridSize / 2;
    const yPos = y + row * gridSize + gridSize / 2;

    const path = `./public/salen/Y${row}X${col}.png`;

    await page.touchscreen.tap(xPos, yPos);
    await page.screenshot({ path });

    await imagemin([path], {
      destination,
      plugins: [imageminPngquant({ quality: [0.5, 0.5] })],
    });

    await cloudinary.uploader
      .upload(path, {
        unique_filename: false,
        use_filename: true,
        folder: "salen",
      })
      .catch((error) => {
        console.log(error);
      });

    generated++;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Generated: ${drawProgressBar(generated, total)}`);
  }
}

process.exit(1);
