// this package is in early development and is not ready for production use
// nothing will work, so dont complainn about it on the issues page
// if u know how to fix something feel free to make a pull request and make an issue describing the problem and how to fix it it with as much detail as possible
// i luv u so much bye bye <3

const puppeteer = require('puppeteer');

async function getClasses(schoolPrefix, sessionId) {
  const url = `https://${schoolPrefix}.compass.education/`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cookies = [
    {
      name: 'ASP.NET_SessionId',
      value: sessionId,
      domain: `${schoolPrefix}.compass.education`,
    },
  ];
  await page.setCookie(...cookies);
  await page.goto(url);

  try {
    await page.waitForSelector(`#calendardaywidget-1013-day-bd-day-col-${formattedDate}`, { timeout: 5000 });
  } catch (error) {
    console.log('Failed to find calendar! We do a little debugging');
    await browser.close();
    return [];
  }

  const classes = [];
  const events = await page.$$(// select all events under the specified date div
    `#calendardaywidget-1013-day-bd-day-col-${formattedDate} > div`
  );
  for (const event of events) {
    const className = await event.$eval('.ext-evt-bd', (element) => element.innerText.split(':')[2]);
    const classTime = await event.$eval('.ext-evt-bd', (element) => element.innerText.split(':')[0]);
    const classRoom = await event.$eval('.ext-evt-bd', (element) => element.innerText.split(':')[4]);
    const classTeacher = await event.$eval('.ext-evt-bd', (element) => element.innerText.split(':')[6]);
    classes.push({ name: className, time: classTime, room: classRoom, teacher: classTeacher });
  }

  await browser.close();
  return classes;
}

module.exports = getClasses;
