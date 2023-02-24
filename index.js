const puppeteer = require('puppeteer');

async function getClasses(schoolPrefix, sessionId) {
  // Check if school prefix is valid
  if (schoolPrefix.includes('schools.compass.education')) {
    console.log('Invalid school prefix');
    return;
  }

  // Set up Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to Compass login page
  await page.goto(`https://${schoolPrefix}.compass.education/Login.aspx`);

  // Set the ASP.NET_SessionId cookie
  await page.setCookie({
    name: 'ASP.NET_SessionId',
    value: sessionId,
    domain: `${schoolPrefix}.compass.education`,
    path: '/',
  });

  // Refresh the page to log in with the cookie
  await page.reload();

  // Check if ASP.NET_SessionId is valid
  const invalidSessionId = await page.evaluate(() => {
    const title = document.title;
    return title === 'Error - Compass' || title === 'Error';
  });
  if (invalidSessionId) {
    console.log('Invalid ASP.NET_SessionId');
    await browser.close();
    return;
  }

  // Look for .ext-evt-bd and get the text from it
  const classText = await page.evaluate(() => {
    const classElements = document.querySelectorAll('.ext-evt-bd');
    const classText = [];
    classElements.forEach((element) => {
      classText.push(element.innerText);
    });
    return classText;
  });

  // Parse the class text into an array of objects
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

  // Close the browser and return the classes
  await browser.close();
  return classes;
}

module.exports = {
  getClasses,
};
