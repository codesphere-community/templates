from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/complete', methods=['POST'])
def complete_code():
    data = request.json
    code_snippet = data.get('code_snippet', '')
    from ai_model.model import CodeCompletionModel
    model = CodeCompletionModel()
    completion = model.complete_code(code_snippet)
    return jsonify({'completion': completion})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
