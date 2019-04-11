import flask
from flask_cors import CORS
from os import listdir
from os.path import join
import subprocess

app = flask.Flask(__name__, static_url_path="", static_folder='../static/dist')
CORS(app)
PATH = './samples'

def samples():
    lst = [filename[:-4] for filename in listdir(PATH) if filename.endswith('.mp3')]
    lst.sort()
    return lst

@app.route('/')
def index():
    return flask.send_from_directory('../static/dist', 'index.html')

@app.route('/samples')
def get_samples():
    return flask.jsonify(samples())

@app.route('/play/<name>')
def play_sample(name):
    if name in samples():
        subprocess.Popen(['mpg321', '-qg 800', join(PATH, name + '.mp3')])
        return '', 200
    else:
        return '', 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
