from flask import Flask
from flask import request
from flask import make_response
from flask_cors import cross_origin
from pdf_completion import generate_pdf

app = Flask('SNapplication')

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/create_pdf', methods=['GET','POST'])
@cross_origin(headers=['Content-Type'])
def create_pdf():
    if request.method == 'POST':
        formatted_req = extract_request(request.get_json())
        if(generate_pdf(formatted_req)):
            return make_response("OK", 200)
        else:
            return make_response("Failure", 400)
    else:
        return 'Whatcha wanna GET?'

def extract_request(r):
    d = []
    d.append(('Name', r['name']['first_name'] + " " + r['name']['last_name']))
    d.append(('Address', r['address']['address']))
    return d
