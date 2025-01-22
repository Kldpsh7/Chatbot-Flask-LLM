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
        jsonData=None,
        url=None,
        messages=None,
        headers=None,
        webSearch=False ):
        self.headers = headers
        self.messages = messages
        if(webSearch):
            data = self.scarper.scarpe(jsonData['prompt'])
            if(data!=None):
                messages.append({"role": "system", "content": f"user used webSearch feature, heres the scarped result: {data}"})

        response = requests.request(
            url=url,
            data=json.dumps(jsonData),
            stream=False,
            headers=self.headers,
            method='POST'
            )
        self.ai = ''
        if(response.status_code!=200):
            return f'an error occured\napi status_code: {response.status_code}\napi response: {response.text}',500
        if(handle_stream):
            # print([json.loads(i.decode('utf-8')).get('message').get('content') for i in response.iter_lines()])
            return self.handle_stream(response=response)
        else:
            self.ai = response.text
            self.messages.append({"role":"assistant","content":self.ai})    
            return self.ai

    def handle_stream(self,response):
        def generator():
            for data in response.iter_lines():
                data = data.decode('utf-8')
                # data = data[6:]

                try:
                    data = json.loads(data)
                    chunk = data['message']['content']
                    self.ai+=chunk
                    yield chunk
                except json.JSONDecodeError:
                    pass
                except Exception as e:
                    yield str(data)
                    return
            self.messages.append({"role":"assistant","content":self.ai})
        return Response(generator()) 