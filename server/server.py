import flask
import os
import subprocess

app = flask.Flask(__name__, static_url_path="", static_folder='../static/dist')
PATH = './samples'


def samples():
    return {root: [os.path.join(root, file) for file in files if file[0] != '.'] for root, _, files in os.walk(PATH)}


@app.route('/')
def index():
    return flask.send_from_directory('../static/dist', 'index.html')


@app.route('/samples')
def get_samples():
    return flask.jsonify(samples())


@app.route('/play', methods=['GET'])
def play_sample():
    sample = flask.request.args.get('sample')
    if sample in [sample for samples in samples().values()
                  for sample in samples]:
        subprocess.Popen(
            ['mpg321', '-qg 100', os.path.join(sample)])
        return '', 200
    else:
        return '', 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
