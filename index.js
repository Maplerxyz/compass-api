'use strict';

const p = require('puppeteer');
const EventEmitter = require('events');

class Compass extends EventEmitter {

    BASE_URL = null;

    browser = null;
    page = null;

    settings = {showChrome: false, pageDelay: 2500};

    constructor(school_prefix, settings) {
        
        super();

        if(typeof school_prefix != 'string' && typeof school_prefix != 'undefined')
            throw(new Error(`Invalid type for school_prefix, ${typeof school_prefix} not string`));

        if(typeof settings != 'object' && typeof settings != 'undefined')
            throw(new Error(`Invalid type for settings, ${typeof settings} not object`));

        if(!school_prefix)
            throw(new Error("Missing school_prefix constructor"));

        this.BASE_URL = `https://${school_prefix}.compass.education/`;

        if(settings != undefined) this.settings = settings;

        if(!this.settings.showChrome) this.settings.showChrome = false;
        if(!this.settings.pageDelay) this.settings.pageDelay = 2500;

        this.init();

    }

    async checkLoggedIn() {

        if(this.page == null)
            throw(new Error(`Compass instance not initialized`))

        await this.page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });

        const cookies = await this.page.cookies();

        for(let cookie of cookies) {
            if(cookie.name == "ASP.NET_SessionId") {
                this.emit('logged-in');
                return true;
            }
        }

        return false;

    }

    async getClasses() {

        const classText = await this.page.evaluate(() => [...document.querySelectorAll('.ext-evt-bd')].map(elem => elem.innerText));
        var classes = [];

        for(var i in classText) {

            var newClass = {};

            var classData = classText[i].split(' ');

            newClass.time = classData[0].slice(0, -1);
            newClass.name = classData[3];
            newClass.room = classData[5];
            newClass.teacher = classData[7];

            classes.push(newClass);

        }

        return classes;

    }

    async returnHome() {

        await this.page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });

        await this.page.waitFor(this.settings.pageDelay);
        
    }

    async init() {
        

        this.browser = await p.launch({
            headless: !this.settings.showChrome
        });

        this.page = await this.browser.newPage();

        if(await this.checkLoggedIn()) {
            console.log('User is logged in.');
        } else {
            console.log('User is not logged in.');
        }

        this.emit('initialized');

    }


}


module.exports = Compass;
