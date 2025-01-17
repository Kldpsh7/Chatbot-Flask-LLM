import requests,json
from config import Response
from application.utils.web_search import WebScarper
class ChatCompletionAPI():
    def __init__(self):
        self.scarper = WebScarper()
    def make_request(
        self,
        method='POST',
        stream=True,
        handle_stream=False,
        json=None,
        url=None,
        messages=None,
        headers=None,
        webSearch=False ):
        self.headers = headers
        self.messages = messages
        if(webSearch):
            data = self.scarper.scarpe(json['prompt'])
            if(data!=None):
                messages.append({"role": "system", "content": f"user used webSearch feature, heres the scarped result: {data}"})

        response = requests.request(
            url=url,
            json=json,
            stream=stream,
            headers=self.headers,
            method=method)
        self.ai = ''
        if(response.status_code!=200):
            return f'an error occured\napi status_code: {response.status_code}\napi response: {response.text}',500
        if(handle_stream):
            return self.handle_stream(response=response)
        else:
            self.ai = response.text
            self.messages.append({"role":"assistant","content":self.ai})    
            return ai

    def handle_stream(self,response):
        def generator():
            for data in response.iter_lines():
                data = data.decode()
                data = data[6:]

                try:
                    data = json.loads(data)
                    chunk = data['choices'][0]['delta']['content']
                    self.ai+=chunk
                    yield chunk
                except json.JSONDecodeError:
                    pass
                except Exception as e:
                    yield str(data)
                    return
            self.messages.append({"role":"assistant","content":self.ai})
        return Response(generator()) 