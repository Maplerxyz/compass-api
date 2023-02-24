// this package is in early development and is not ready for production use
// nothing will work, so dont complainn about it on the issues page
// if u know how to fix something feel free to make a pull request and make an issue describing the problem and how to fix it it with as much detail as possible
// i luv u so much bye bye <3

const puppeteer = require('puppeteer');

async function getClasses(schoolPrefix, sessionId) {
  const url = `https://${schoolPrefix}.compass.education/Calendar/CalendarWeek`;
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
    await page.waitForSelector('.ext-evt-bd', { timeout: 5000 });
  } catch (error) {
    console.log('Failed to find calendar! We do a little debugging');
    await browser.close();
    return [];
  }

  const classText = await page.evaluate(() => {
    const classElements = document.querySelectorAll('.ext-evt-bd');
    const classText = [];
    classElements.forEach((element) => {
      classText.push(element.innerText);
    });
    return classText;
  });

  const classes = [];
  for (const i in classText) {
    const newClass = {};
    const classData = classText[i].split(' ');
    newClass.time = classData[0].slice(0, -1);
    newClass.name = classData[3];
    newClass.room = classData[5];
    newClass.teacher = classData[7];
    classes.push(newClass);
  }

  await browser.close();
  return classes;
}

module.exports = getClasses;