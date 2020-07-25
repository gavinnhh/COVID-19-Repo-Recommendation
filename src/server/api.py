


##############################
#
#   This file is the same as the api.py in /api/venv
#
##############################




from flask import Flask, request, jsonify,render_template
import boto3
import pandas as pd
import json
from flask_cors import CORS
from bs4 import BeautifulSoup

app = Flask(__name__)

CORS(app)

app_name = 'covid19-repo-recommender'
region = 'us-west-1'

sm = boto3.client('sagemaker', region_name=region)
smrt = boto3.client('runtime.sagemaker', region_name=region)

# Check endpoint status
endpoint = sm.describe_endpoint(EndpointName=app_name)
print("Endpoint status: ", endpoint["EndpointStatus"])

# to retrive data in browser for this get method, do like this:
# http://127.0.0.1:5000/?language=Java&keyword=Web
@app.route('/', methods=['GET'])
def get_prediction_by_get():
	language = request.args.get('language')
	keyword = request.args.get('keyword')
	input_data = pd.DataFrame([[language, keyword]]).to_json(orient="split")
	print(input_data)
	prediction = smrt.invoke_endpoint(
			EndpointName=app_name,
			Body=input_data,
			ContentType='application/json; format=pandas-split'
		)
	
	prediction = prediction['Body'].read()
	return jsonify(prediction)

@app.route('/', methods=['POST'])
def get_prediction_by_post():
	data = request.get_json() # get the data from body: JSON.stringify(formData) in App.js
	
	input_data = pd.DataFrame([[data['language'], data['keyword']]]).to_json(orient="split")
	prediction = smrt.invoke_endpoint(
			EndpointName=app_name,
			Body=input_data,
			ContentType='application/json; format=pandas-split'
		)
	
	prediction = prediction['Body'].read().decode("utf-8")

	final_dictionary = prediction.split("}, {")
	final_dictionary[0] = final_dictionary[0][3:]  # get rid of "[[{" in the front
	final_dictionary[9] = final_dictionary[9][:-3]  # get rif of "}]]" in the end

	for i in range(len(final_dictionary)):
		final_dictionary[i] = "{" + final_dictionary[i] + "}"
		final_dictionary[i] = json.loads(final_dictionary[i])
		URL = final_dictionary[i]["github_repo_url"]
		page = requests.get(URL)
		soup = BeautifulSoup(page.content, 'html.parser')
		starTags = soup.findAll("a", "social-count js-social-count")
		starTag = starTags[0]
		htmlstartxt = str(starTag)
		star = BeautifulSoup(htmlstartxt, 'lxml').text
		final_dictionary[4]["count_of_stars"] = star
	
	return jsonify(final_dictionary)
	# recommendations = jsonify(prediction)
	# return jsonify(prediction)

if __name__ == '__main__':
    app.run(debug=True)
