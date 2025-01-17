class Request{
    constructor(){

    }
    async request(method,url,headers={},payload=null,stream=false){
        try {
            const response = await fetch(url,{
                method: method,
                headers: headers,
                body: payload
            })
            if(stream && response.ok){
                return this.handleStream(response)
            } else{
                return response
            }
        } catch (error) {
            return error
        }
        
    }

    async *handleStream(response){
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while(true){
            const {done,value} = await reader.read()
            if(done){
                break
            }
            const chunk = decoder.decode(value,{stream:true})
            yield chunk
        }
    }
}

const requests = new Request()
export default requests