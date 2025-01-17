import requests from "./request.js";

class Chat{
    constructor(uiManager){
        this.uiManager = uiManager;
    }
    async chat(){
        let payload = {
            "model": this.uiManager.initializer.model,
            "prompt": this.uiManager.userP.innerText.trim(),
            "convId": this.uiManager.initializer.convId,
            "system": this.uiManager.initializer.systemPrompt,
            "temperature": 0.7,
            "top_p": 0.9,
            "webSearch": this.uiManager.webSearch
        };
        try {
            if(this.uiManager.initializer.convId==null){
                await this.uiManager.initializer.createConv();
                payload["convId"] = this.uiManager.initializer.convId;
            }
            this.uiManager.textBox.value='';
            this.uiManager.sendBtn.disabled = true;
            const response = await requests.request('POST','/completions',{"Content-Type": "application/json"},JSON.stringify(payload),true);
            for await (const chunk of response){
                this.uiManager.aiP.innerHTML+=chunk;
                this.uiManager.renderSymbols.renderAll(this.uiManager.aiP)
            };
        } catch (error) {
            this.uiManager.sendBtn.disabled = false;
            this.uiManager.aiP.innerHTML+= `<span class="error" style="color: red;">${error}</span>`;
            return
        }
        this.uiManager.renderSymbols.renderCode(this.uiManager.aiP);
        if(this.uiManager.initializer.convTitle==null){
            this.uiManager.initializer.convTitle = this.uiManager.userP.innerText.substring(0,23);
            this.uiManager.addChat();
        }
        this.uiManager.sendBtn.disabled = false;

    }
}

export default Chat