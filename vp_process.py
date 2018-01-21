import os, subprocess, json, sys, errno, argparse

def run(root):
	output = []
	for folder in range(2012,2018):
		folder = str(folder)
		directory = os.path.join(root,folder)
		txtdirectory = os.path.join(directory, 'txt')
		try:
			os.mkdir(txtdirectory)
		except OSError as e:
			if e.errno != errno.EEXIST:
				raise
		for filename in os.listdir(directory):
			command = ['pdftotext', os.path.join(directory, filename), os.path.join(txtdirectory, os.path.splitext(filename)[0]+'.txt')]
			subprocess.call(command)

		for filename in os.listdir(txtdirectory):
			doc = {'PRESENT': [], 'ABSENT':[], 'filename':filename, 'meta': [], 'year': folder, "AYES": [], "NOES": [], "ABSTENTION": []}
			filename = os.path.join(txtdirectory,filename)
			flag = ''
			with open(filename, 'r') as f:
				line = f.readline()
				cnt = 0
				while line:
					stripped = line.strip()
					upper = stripped.upper()
					if upper.startswith('PRESENT'):
						flag = 'PRESENT'
					elif upper.startswith('ABSENT'):
						flag = 'ABSENT'
					elif upper.startswith('AYES'):
						flag = 'AYES'
					elif upper.startswith('ABSTENTION'):
						flag = 'ABSTENTION'
					elif upper.startswith('NOES'):
						flag = 'NOES'
					else:
						if len(flag) > 0 and flag != 'PRESENT' and len(stripped) == 0 :
							flag = ''
						elif len(stripped)>0:
							if flag != '' :
								doc[flag].append(stripped)
							elif cnt <5:
								doc['meta'].append(stripped)
					line = f.readline()
					cnt +=1
			output.append(doc)

	with open(os.path.join(root, 'output.json'),'w') as w:
		w.write(json.dumps(output))

if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('-i', '--in', default='/Users/jean/Development/profile-scraper/parliament-tracker/votes_and_proc')
	args = parser.parseArgs()
	print(args)
	run(args['in'])



	