import puppeteer from "puppeteer";

const browser = await puppeteer.launch();

const gridSize = 10;

const page = await browser.newPage();

await page.goto("http://localhost:3000/generate");
await page.setViewport({ width: 430, height: 760 });
await page.waitForSelector("img");

const map = await page.$("#touchzone");
const { x, y, width, height } = await map.boundingBox();

const columns = width / gridSize;
const rows = height / gridSize;

let generated = 0;

console.time("TimeToGenerate");

for (let row = 0; row <= rows; row++) {
  for (let col = 0; col <= columns; col++) {
    const xPos = x + col * gridSize + gridSize / 2;
    const yPos = y + row * gridSize + gridSize / 2;

    await page.touchscreen.tap(xPos, yPos);
    await page.screenshot({
      path: `./public/salen/Y${row}X${col}.png`,
      type: "png",
    });
    generated++;
    console.log(`Row: ${row}, Col: ${col} was generated.`);
  }
}

console.timeEnd("TimeToGenerate");
console.log(`Generated ${generated} images.`);
process.exit(1);
