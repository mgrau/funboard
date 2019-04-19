# funboard
A soundboard website that plays audio on the host computer

Will play mp3 samples placed in the `samples/` folder. Requires mpg321 to play mp3s and espeak for text to voice.


# Installation
```
git clone https://github.com/mgrau/funboard
cd funboard
./install.sh
venv/bin/gunicorn -b 0.0.0.0:80 server.server:app
```
