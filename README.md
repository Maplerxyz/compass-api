# COMPASSEDUAPI IS STILL IN EARLY STAGES AND POSSIBLY MAY NOT WORK, PLEASE DO NOT USE THIS API IN PRODUCTION

# Welcome to the unofficial Compass.education API (compasseduapi)!
Compasseduapi is an unofficial API for JDLF'S Compass school manager (compass.education) that uses  puppeteer 


## Installation
The installion of compasseduapi is very easy due to the api being an npm package, just run the following command in your terminal:
```bash
npm install compasseduapi
```
If puppeteer fails to install with the package you can always install it manually with the following command:

```bash
npm install puppeteer
```

Now it's time to use the api!

## Usage
The usage of compasseduapi is very easy, just import the package and use the functions! An example of how you can use the api is shown below. More in-depth documentation can be found in the documentation section. (Coming Soon)
```js
const { getClasses } = require('compasseduapi');

async function test() {
  const schoolPrefix = 'school_prefix_here';
  const sessionId = 'your_asp.net.session_id_here';
  const classes = await getClasses(schoolPrefix, sessionId);
  console.log(classes);
}

test();
```

This script requires the compasseduapi package. It also specifies the school_prefix and the ASP.NET_SessionID as sessionId (as requires by the api). It then logs the classes to the console.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## I found a bug!

If you find a bug, please open an issue on the github repository. Please make sure to include as much information as possible, including the error message, the code you used, and the version of compasseduapi you are using.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Disclaimer

This project is not affiliated with Compass Education, JDLF, or any of its subsidiaries or its affiliates. Compass Education, JDLF, and all related logos are trademarks of Compass Education, JDLF, or its affiliates in Australia and/or other countries.


Thank you for using compasseduapi! Make sure to star the repo and follow me on github!
