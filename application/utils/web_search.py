import requests
from googlesearch import search
from bs4 import BeautifulSoup
import re
import random
class WebScarper:
    def __init__(self):
        pass
    def get_url(self,query):
        results = []
        for result in search(query, num_results=3):
            results.append(result)
        if(results!=[]):
            return random.choice(results)
        else:
            return None
    def fetch_url(self, url):
        try: 
            headers = { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            } 

            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                raise Exception(f"Unable to fetch URL, status code: {response.status_code}")
            return response.text
        
        except Exception as e:
            print(f"Error: {e}")
            return None


    def get_text(self, data):
        soup = BeautifulSoup(data, 'html.parser')
        text = soup.get_text() 
        cleaned_text = re.sub(r'\s+', ' ', text).strip() 
        if(len(cleaned_text)>4000):
            return cleaned_text[:4000]
        else:
            return cleaned_text
        

    def scarpe(self,query):
        url = self.get_url(query)
        data = self.fetch_url(url)
        if(data==None or url==None):
            return None
        return self.get_text(data)
    
