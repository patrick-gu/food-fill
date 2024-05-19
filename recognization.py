import base64
import io

from flask import Flask, request, jsonify
from flask_cors import cross_origin
from transformers import pipeline
from PIL import Image

app = Flask(__name__)

ml_pipeline = pipeline("image-classification", model="nateraw/food")


@app.route('/recognize', methods=['POST'])
@cross_origin()
def recognize():
    file = request.data
    image = Image.open(io.BytesIO(file))
    result = ml_pipeline(image)
    return jsonify(result)


if __name__ == '__main__':
    app.run()
