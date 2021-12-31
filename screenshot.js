const puppeteer = require('puppeteer').launch();
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const chalk = require('chalk');

const src = `file://${process.cwd()}/development/generate.html`;
const folder = `${process.cwd()}/generated/`;
const columns = 50;
const rows = 100;
const viewWidth = 375;
const viewHeight = 667;

let counter = 0;
let worker_env = {};

function startWorker() {
  console.log(`Starting worker for row ${chalk.blue(counter)}.`);
  worker_env['LOOP'] = counter;
  counter++;
  cluster.fork(worker_env);
}

if (cluster.isMaster) {
  console.log(`Master Process: ${chalk.yellow(process.pid)} is running.`);
  for (let i = 0; i < numCPUs; i++) {
    startWorker();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${chalk.green(worker.process.pid)} is online.`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${chalk.magenta(worker.process.pid)} died.`)
    if (counter <= rows) {
      startWorker();
    }
  });
} else if (cluster.isWorker) {
  (async () => {
    let y = process.env['LOOP'];
    const browser = await puppeteer;
    const page = await browser.newPage();
    page.setViewport({
      width: viewWidth,
      height: viewHeight,
      deviceScaleFactor: 2
    });
    await page.goto(src);

    let box = await page.$('#seatings');
    box = await box.boundingBox();

    const spacingWidth = box.width / columns;
    const spacingHeight = box.height / rows;

    for (let x = 0; x <= columns; x++) {
      let file = `Y${y}X${x}.png`;
      let folderfile = folder + file;
      
      await page.mouse.click((x * spacingWidth) + box.x, (y  * spacingHeight) + box.y);
      await page.screenshot({ path: folderfile });
      await imagemin([folderfile], folder, {
        plugins: [
          imageminPngquant({ quality: [0.7, 0.9] })
        ]
      });

      console.log('Generated: ' + chalk.white(file));
    }
    await browser.close();
    cluster.worker.kill();
  })();
}
