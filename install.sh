#!/bin/bash
npm run build --prefix static

python3 -m venv venv
venv/bin/pip install -r requirements.txt
