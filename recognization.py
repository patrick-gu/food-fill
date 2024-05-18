from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

@app.route('/recognize', methods=['POST'])
def recognize():
    file = request.json['url']
    # print(file)

    ml_pipeline = pipeline("image-classification", model="nateraw/food")
    result = ml_pipeline(file)
    # print(result)
    result = max(result, key=lambda x: x['score'])

    return jsonify({
        'food': result['label']
    })

if __name__ == '__main__':
    app.run()