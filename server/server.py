import flask
import os
import subprocess

app = flask.Flask(__name__, static_url_path="", static_folder='../static/dist')
PATH = './samples'

if os.path.isfile('endpoint'):
    with open('endpoint') as file:
        ENDPOINT = '/' + ''.join(file.readline().split())
else:
    ENDPOINT = '/'


def samples():
    return {root: [os.path.join(root, file) for file in files if file[0] != '.'] for root, _, files in os.walk(PATH)}


@app.route(ENDPOINT)
def index():
    return flask.send_from_directory('../static/dist', 'index.html')


print(ENDPOINT)
print(os.path.join(ENDPOINT, 'samples'))


@app.route(os.path.join(ENDPOINT, 'samples'))
def get_samples():
    return flask.jsonify(samples())


@app.route(os.path.join(ENDPOINT, 'play'), methods=['GET'])
def play_sample():
    sample = flask.request.args.get('sample')
    if sample in [sample for samples in samples().values()
                  for sample in samples]:
        subprocess.Popen(
            ['mpg321', '-qg 100', os.path.join(sample)])
        return '', 200
    else:
        return '', 404


@app.route(os.path.join(ENDPOINT, 'speak'), methods=["GET"])
def speak():
    text = flask.request.args.get('text')
    subprocess.Popen(['espeak', text, '-s 220 -g 10'])
    return '', 200


@app.route(os.path.join(ENDPOINT, 'stop'))
def stop():
    subprocess.Popen(['killall', 'mpg321'])
    subprocess.Popen(['killall', 'espeak'])
    return '', 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
