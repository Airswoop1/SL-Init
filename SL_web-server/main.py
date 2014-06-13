from flask import Flask
from flask import request
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/create_pdf', methods=['GET','POST'])
def create_pdf():
    if request.method == 'POST':
        generate_pdf()
        return 'Generating PDF'
    else:
        return 'Whatcha wanna GET?'

if __name__ == '__main__':
    app.run(debug=True)