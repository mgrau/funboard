import flask
from os import listdir
from os.path import join
import subprocess

app = flask.Flask(__name__)
PATH = './samples'

def samples():
    return [filename[:-4] for filename in listdir(PATH) if filename.endswith('.mp3')]

@app.route('/')
def index():
    return ''

@app.route('/samples')
def get_samples():
    return flask.jsonify(samples())

@app.route('/play/<name>')
def play_sample(name):
    if name in samples():
        subprocess.Popen(['mpg321', '-q', join(PATH, name + '.mp3')])
        return '', 200
    else:
        return '', 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
