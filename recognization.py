from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/recognize', methods=['POST'])
def recognize():
    file = request.files['image']

    # ML

    return jsonify({
        'food': 'Apple'
    })

if __name__ == '__main__':
    app.run()