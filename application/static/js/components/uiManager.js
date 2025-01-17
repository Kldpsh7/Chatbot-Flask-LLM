import Initialize from "./initialize.js";
import Chat from "./chat.js";
import RenderSymbols from "./renderSymbols.js";
class UIManager{
    constructor(){
        this.initializer = new Initialize(this);
        this.chat = new Chat(this);
        this.renderSymbols = new RenderSymbols();
        this.menu = document.getElementById('menu');
        this.hamburger = document.getElementById('hamburger');
        this.messagesDiv = document.getElementById('messages');
        this.container = document.getElementById('container')
        this.prevChatsCont = document.getElementById('prevChatsCont'); 
        this.textBox = document.getElementById('textBox');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChat = document.getElementById('newChat');
        this.models = document.getElementById('models');
        this.initialized = false;
        this.webSearchBtn = document.getElementById('webSearch');
        this.webSearch = false;
        this.aiDiv;
        this.userDiv;
        this.aiP;
        this.userP;
    }
    async run(){
        await this.initializer.initialize();
        this.handleTextBoxHeight();
        this.events();
    }
    events(){
        this.sendBtn.addEventListener('click',()=>{
            this.send();
        })
        window.addEventListener('keydown',(e)=>{
            if(e.key=='Enter' && !this.sendBtn.disabled){
                this.send();
            }
        })
        this.newChat.addEventListener('click', async ()=>{
            await this.initializer.initialize();
        })
        this.webSearchBtn.addEventListener('click', ()=>{
            if(this.webSearch){
                this.webSearchBtn.style.color = 'white';
            } else{
                this.webSearchBtn.style.color = 'rgba(30,30,250,0.8)';
            }
            this.webSearch = !this.webSearch;
            
        })
        document.getElementById('closeAlert').onclick = ()=>{
            document.getElementById('alert').style.display = 'none'
        }
    }
    async send(){
        this.appendUserMsg();
        this.appendAiMsg();
        await this.chat.chat();
    }

    appendUserMsg(msg=false){
        this.userDiv = document.createElement('div');
        this.userDiv.className = 'user';
        this.userP = document.createElement('p');
        if(msg){
            this.userP.innerText = msg;
        } else{
            this.userP.innerText = this.textBox.value;
        }
        this.userDiv.appendChild(this.userP);
        this.messagesDiv.appendChild(this.userDiv);
    }
    appendAiMsg(msg=false){
        this.aiDiv = document.createElement('div');
        this.aiDiv.className = 'ai';
        this.aiP = document.createElement('p');
        if(msg){
            this.aiP.innerText=msg;
        }
        this.aiDiv.appendChild(this.aiP);
        this.messagesDiv.appendChild(this.aiDiv);
    }
    handleTextBoxHeight() {
        this.textBox.oninput = () => {
            //this.textBox.value = this.textBox.value.trim();     
            this.textBox.style.height = 'auto';
            if (this.textBox.scrollHeight <= 150) {
                if(this.textBox.scrollHeight>60){
                    this.textBox.style.height = `${this.textBox.scrollHeight}px`;
                }
            } else {
                this.textBox.style.height = '150px';
            }
        };
    }
    addChat(){
        const prevChat = document.createElement('div');
        prevChat.innerText = this.initializer.convTitle;
        prevChat.className = 'prevChat';
        prevChat.id = this.initializer.convId;
        this.prevChatsCont.prepend(prevChat);
        prevChat.style.backgroundColor = 'rgb(53, 53, 53)';
        prevChat.addEventListener('click', ()=>{
            this.initializer.reInitialize(prevChat.id);
        })
    }
}
export default UIManager