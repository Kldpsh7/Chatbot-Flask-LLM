class RenderSymbols{
    constructor(){

    }
    renderAll(elem){
        this.renderText(elem);
        this.renderCode(elem);
        this.renderMath(elem);
        elem.scrollIntoView({behavior: "smooth", block: "end"});
    }
    renderMath(elem) {
        let content = elem.innerHTML;
        MathJax.typesetPromise([elem])
            .then(() => {
                
            })
            .catch((err) => {

            });
    }
    renderText(elem){
        elem.innerHTML = elem.innerHTML.replace(/<br\s*\/?>/g, '\n');
        elem.innerHTML = elem.innerHTML.replace(/\#\#\#(.*?)\#\#\#/g, '<span class="heading">$1</span>');
        elem.innerHTML = elem.innerHTML.replace(/\*\*\*(.*?)\*\*\*/g, '<span class="boldText">$1</span>');
        elem.innerHTML = elem.innerHTML.replace(/\*\*(.*?)\*\*/g, '<span class="subHeading">$1</span>');
        elem.innerHTML = elem.innerHTML.replace(/\n/g, '<br>');
    }
    renderCode(element) {
        let content = element.innerHTML;
    
        if (content.includes("```") && content.split("```").length >= 3) {
            content = content.replace(/```(\w*)<br>([\s\S]*?)```/g, (match, language, code) => {
                code = code.replace(/<br>/g, '\n').trim();
                language = language.trim() || 'text';    
                code = this.escapeHTML(code);
    
                return `<pre class="code-block"><code class="language-${language}">${code}</code></pre>`;
            });
    
            element.innerHTML = content;
    
            element.querySelectorAll('code:not(.hljs)').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }
    escapeHTML(str) {
        return str.replace(/[&<>"']/g, function (char) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            };
            return map[char] || char;
        });
    }
  
}
export default RenderSymbols