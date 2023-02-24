// this package is in early development and is not ready for production use
// nothing will work, so dont complainn about it on the issues page
// if u know how to fix something feel free to make a pull request and make an issue describing the problem and how to fix it it with as much detail as possible
// i luv u so much bye bye <3

const puppeteer = require('puppeteer');

async function getClasses(schoolPrefix, sessionId, date) {
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
    await page.waitForSelector(`#calendardaywidget-1013-day-bd-day-col-${date}`, { timeout: 5000 });
  } catch (error) {
    console.log(`Failed to find calendar for date ${date}.`);
    await browser.close();
    return [];
  }

  try {
    const events = await page.$$('div[id^="ext-gen"]');
    const classes = [];
    for (const event of events) {
      const classData = await event.$('.ext-evt-bd');
      if (classData) {
        const classText = await classData.evaluate(node => node.innerText);
        const newClass = {};
        const classDetails = classText.split('\n');
        newClass.time = classDetails[0];
        newClass.name = classDetails[1];
        newClass.room = classDetails[2];
        newClass.teacher = classDetails[3];
        classes.push(newClass);
      }
    }
    await browser.close();
    return classes;
  } catch (error) {
    console.log(`An error occurred while extracting classes for date ${date}: ${error}`);
    await browser.close();
    return [];
  }
}

module.exports = getClasses;
