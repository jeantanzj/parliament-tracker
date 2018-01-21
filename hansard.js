var webdriverio = require('webdriverio'),
    async       = require('async'),
    fs          = require('fs'),
    winston 	= require('winston')

winston.configure({
    transports: [
      new winston.transports.File({ filename: 'hansard.log'})
    ]
 });

p=13
url = 'https://sprs.parl.gov.sg/search/'
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var browser = webdriverio.remote(options).init()


var search = browser.url(url)
.selectByValue('select#parliamentNo', p)
.waitForEnabled('#B_Search', 1000)
.scroll('#B_Search')
.element('#B_Search')
.click()
.getTabIds()
.then(function (handles){
		 winston.info('handles', handles)
         return this.switchTab(handles[handles.length - 1]); 
})

search.waitForVisible('ul.pagination li:nth-child(4)',10000)
.getAttribute('ul.pagination li:nth-child(4) a','href')
.then((v)=>{
	let hrefs = []
	let maxpages =  parseInt(v.replace('javascript:SerResult.doSearch(','').replace(')',''))
	winston.info('maxpages', maxpages)

	let chain = Promise.resolve()
	start = 'javascript:SerResult.openTopic'.length+1
	for (let i = 1; i <=maxpages; i++){
		chain = chain.then(()=> {
				 return search
					.waitForVisible('#searchResults a',10000)
					.getAttribute('#searchResults a', 'onclick')
					.then((resp)=>{
						let v = resp.map((x)=> {
							let arr = []
							if (typeof(x) != 'undefined' && x != null){
								arr = (x.substring(start, x.length-1)).split("\',\'") 
								arr[0] = arr[0].substring(1)
								arr[arr.length-1] = arr[arr.length-1].substring(0, arr[arr.length-1].length-1) 
							}
							return arr })
						hrefs = hrefs.concat(v)
					})
					.catch((e)=>{
						winston.error(e);
					})
					.scroll('.pagination li:nth-child(3) a')
					.pause(500)
					.element('.pagination li:nth-child(3) a')
					.click()
					.catch((e) =>{
						winston.error(e);
					})
			})
	}

	chain.finally(()=>{
		fs.writeFile('parliament_'+p+'.json', JSON.stringify(hrefs), 'utf8', (error)=>{winston.error(error)});
	})
})
.catch((e)=>{
	winston.error(e)
})

// For getting the metadata
/*function topicUrl (pubId, topicId , topicKey, title, date) {
	return 'https://sprs.parl.gov.sg/search/topic.jsp?currentTopicID='+topicId+'&currentPubID='+pubId+'&topicKey='+topicKey
}
function parCallback (err, data)  {
	if (err){ throw err }
	arrlinks = JSON.parse(data)
	output = []
	chain = Promise.resolve()
	for (let i = 0; i< arrlinks.length; i++){
		chain = chain.then(() =>{
			a = arrlinks[i]
			if(a.length != 0){
			
				winston.info(a)
				turl = topicUrl(a[0],a[1],a[2])
				winston.info(turl)
				return browser.url(turl)
				.waitForVisible('.hansardContent table',10000)
				.catch((e)=>{
					winston.error(e)
				})
				.getText('.hansardContent table table tr')
				.then((resp) =>{
					item = {}
					for(let j = 0; j < resp.length; j++){
						let firstColon = resp[j].indexOf(':')
						item[resp[j].substring(0,firstColon)] = resp[j].substring(firstColon+1)
					}
					output.push(item)
				})
				.catch((e)=>{
					winston.error(e)
				})
			}
		})
	}
	chain = chain.finally(() =>{
		fs.writeFile('parliament_'+p+'_callback.json', JSON.stringify(output), 'utf8', (error)=>{winston.error(error)});
	})
	return chain
}

browser.url(url)
	.then(()=>{
	fs.readFile('parliament_'+p+'.json', parCallback)
})
*/

