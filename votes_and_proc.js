var webdriverio = require('webdriverio'),
    async       = require('async'),
    fs          = require('fs'),
    winston 	= require('winston'),
    wget 		= require('wget-improved')


winston.configure({
    transports: [
      new winston.transports.File({ filename: 'hansard.log'})
    ]
 });


url = 'https://www.parliament.gov.sg/parliamentary-business/votes-and-proceedings?parliament=&fromDate=&toDate=&page=1&pageSize=400'



saveFile = function(url){
	let filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
	let source =  url.split('?')[0]
	wget.download(source, filename)
}
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var browser = webdriverio.remote(options).init()

browser.url(url)
.waitForExist('.vp-title a',10000)
.elements('.vp-title a')
.getAttribute('.vp-title a', 'href')
.then((links) =>{
	winston.info('length links', links.length)
	for (let i = 0; i < links.length; i++){
		saveFile(links[i])
		winston.info(links[i])
	}
	
})
