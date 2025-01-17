from application.utils.chat_completion_api import ChatCompletionAPI
from config import Response,pipeline_dict,convs_dict
import os
class ChatInference:
    def __init__(self):
        self.chatCompletionAPI = ChatCompletionAPI()

    def validate(self,data,user):
        try:
            pipeline = pipeline_dict['api']['models']
            model = data['model']
            self.headers = pipeline[model]['headers']
            self.updateHeaders = {}
            for header in self.headers:
                if(header=="config"):
                    for configHeader in self.headers[header]:
                        if(configHeader=="Authorization"):
                            auth = self.headers[header][configHeader].split(' ')
                            self.updateHeaders[configHeader] = f"{auth[0]} {eval(auth[1])}"
                        elif(configHeader=="comment"):
                            pass
                        else:
                            self.updateHeaders[configHeader] = f"{eval(self.headers[header][configHeader])}"
                else:
                    self.updateHeaders[header] = self.headers[header]
            prompt = data['prompt']
            max_tokens = data.get('max_token', 1024)
            temperature = max(0, min(data.get('temperature', 0.7), 2))
            top_p = max(0.1, min(data.get('top_p', 0.9), 1))
            system = data.get('system_prompt','')
            convId = data['convId']
            
            if(len(convs_dict[user][convId]['messages'])==1):
                #convs_dict[user][convId]['messages'].append({"role":"system", "content": system})
                convs_dict[user]['metadata'].insert(0,{"convId": convId, "title": prompt[:23]})
                convs_dict[user][convId]['title'] = prompt[:30]
            if(pipeline[model]['type'] == 'image-text-to-text'):
                convs_dict[user][convId]['messages'].append({"role": "user", "content": [{"type":"text","text":prompt}]})
            else:
                convs_dict[user][convId]['messages'].append({"role":"user","content":prompt})
            transformed = {
                "model": model,
                "prompt": prompt,
                "messages": convs_dict[user][convId]['messages'],
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
                "stream": True
            }
            data.update(transformed)
            return data
        except KeyError:
            return 400

    def chat(self,data,handle_stream,user):
        data = self.validate(data=data,user=user)
        if(data==400):
            return "Required Parameters are Missing!", 400
        return self.chatCompletionAPI.make_request(json=data,url=data['base_url'],handle_stream=handle_stream,messages=data['messages'], headers=self.updateHeaders, webSearch=data['webSearch'])

        
