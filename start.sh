#!/bin/bash
pip install --no-cache-dir -r requirements.txt 
uvicorn scene_enhancer:app --host 0.0.0.0 --port 10000