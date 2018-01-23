import json
import pandas
from pandas.io.json import json_normalize
with open('parliament_13_callback.json', 'r') as f:
	js = json.loads(f.read())

pdf = json_normalize(js)
pdf['MPs Speaking'] = pdf['MPs Speaking'].map(lambda x: x.split(','))
exploded = pdf['MPs Speaking'].apply(pandas.Series).stack().to_frame()
exploded.rename(columns={0:'MP'}, inplace=True)
pdf.index.rename('idx1', inplace=True)
exploded.index.rename(['idx1','idx2'], inplace=True)
result  = pdf.iloc[:,1:].join(exploded)
result.to_json(path_or_buf='parliament_13_reformatted.json',orient='records')
