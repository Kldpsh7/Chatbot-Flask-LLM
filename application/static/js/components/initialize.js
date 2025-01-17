import requests from "./request.js";
class Initialize{
    constructor(uiManager){
        this.convId;
        this.convTitle;
        this.uiManager = uiManager;
        this.systemPrompt = `your response syntax should be: ###for heading### \n ** for sub heading ** \n *** for text highlight/bold text ***`;
        this.model = null;
    }

    async initialize(model=null){
        this.convTitle=null;
        this.convId=null;
        this.uiManager.messagesDiv.innerHTML = '';
        this.uiManager.prevChatsCont.innerHTML = '';
        await this.fetchConvs();
        document.querySelectorAll('.prevChat').forEach((elem)=>{
            elem.addEventListener('click', ()=>{
                this.reInitialize(elem.id)
            })
        })
        if(model!=null){
            this.model = model;
        } else{
            await this.fetchModels()
        }
    }

    async reInitialize(id){
        this.convTitle=null;
        this.convId=id;
        this.uiManager.messagesDiv.innerHTML = '';
        await this.fetchConv(id);
    }

    async fetchConv(id){
        try {
            const response = await requests.request('POST','/fetch',{"Content-Type": "application/json"},JSON.stringify({"convId": id}),false);
            if(!response.ok){
                alert('error while fetching conversations')
                return
            }
            const data = await response.json();
            this.convTitle = data['title'];
            const arr = data['messages'];
            for(let i=0;i<arr.length;i++){
                const dict = arr[i];
                if(dict['role']=='user'){
                    this.uiManager.appendUserMsg(dict['content'])
                }
                else if(dict['role']=='assistant'){
                    this.uiManager.appendAiMsg(dict['content']);
                    this.uiManager.renderSymbols.renderAll(this.uiManager.aiP);
                }
            }
        } catch (error) {
            alert(`an error occured ${error}`)
            console.log(error)
        }
    }
    async fetchConvs(){
        try {
            const response = await requests.request('GET','/convs',{"Content-Type": "application/json"},null,false);
            if(!response.ok){
                alert('error while fetching conversations')
                return
            }
            const data = await response.json();
            for(let i=0;i<data.length;i++){
                const prevChat = document.createElement('div');
                const dict = data[i];
                prevChat.id = dict['convId'];
                prevChat.className = 'prevChat';
                prevChat.innerText = dict['title'];
                this.uiManager.prevChatsCont.appendChild(prevChat)

            }
        } catch (error) {
            alert(`an error ocuured ${error}`)
        }
    }
    async createConv(){
        const response = await requests.request('POST', '/create', {"Content-Type": "application/json"},JSON.stringify({"system_prompt": this.systemPrompt}),false)
        if(!response.ok){
            alert('error while creating new Conversation')
            return
        }
        const data = await response.json()
        this.convId = data['convId']
    }
    async fetchModels(){
        const response = await requests.request('GET', '/models', {"Content-Type": "application/json"},null,false)
        if(!response.ok){
            alert('error while fetching models')
            return
        }
        const data = await response.json();
        this.model = data[0];
        this.uiManager.models.innerHTML = '';
        for(let i=0; i<data.length;i++){
            const opt = document.createElement('option')
            opt.innerText = data[i];
            this.uiManager.models.appendChild(opt)
        }
        this.uiManager.models.addEventListener('change', (e)=>{
            const selected = e.target.value;
            this.initialize(selected)
        })

    }
}
export default Initialize
