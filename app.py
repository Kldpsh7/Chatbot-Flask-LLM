from config import Flask,pipeline_dict,Response,convHandler
from application.chat_inference import ChatInference
from flask import render_template,request

app = Flask(__name__, template_folder='application/templates', static_folder='application/static')

chat_inference = ChatInference()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/completions',methods=['POST'])
def completeions():
    data = request.json
    models = pipeline_dict['api']['models']
    if(data.get('model',None) not in models):
        return "Model Not Found", 404
    model_info = models[data['model']]
    data.update(
        {
            "base_url": model_info['api_url'],
            "type": model_info['type']
        }
    )
    return chat_inference.chat(data=data,handle_stream=pipeline_dict['handle_stream'],user=request.headers.get("X-Forwarded-For", "1,2,3").split(',')[0].strip())
    
@app.route('/convs')
def get_conv():
    return convHandler.get_conv(request.headers.get("X-Forwarded-For", "1,2,3").split(',')[0].strip())

@app.route('/create', methods=['POST'])
def create_conv():
    sysPrompt = request.json.get('system_prompt', '')
    return convHandler.create_conv(ip=request.headers.get("X-Forwarded-For", "1,2,3").split(',')[0].strip(),sysPrompt=sysPrompt)
@app.route('/fetch', methods=['POST'])
def fetch():
    convId = request.json.get('convId')
    return convHandler.fetch_conv(convId=convId,ip=request.headers.get("X-Forwarded-For", "1,2,3").split(',')[0].strip())
@app.route('/models')
def models():
    return list(pipeline_dict['api']['models'].keys())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=True)

