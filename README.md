# parliament-tracker

## Run selenium

`java -Dwebdriver.chrome.driver=chromedriver -jar selenium-server-standalone-3.4.0.jar`

## Save files from Votes and Proceedings

`node votes_and_proc.js`

Try to segment the votes and proceedings... doesn't work very well because of the pdf to txt conversion doesnt keep the table

`brew install poppler`

`python vp_process.py`

## Get metadata for parliamentary debates
`node hansard.js`

