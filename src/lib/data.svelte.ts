import { goto } from "$app/navigation";
import type { Chat, FileData, Mensagem } from "$lib"
import axios, { AxiosError } from "axios";
import signal from "./signal.svelte";

class Data {

    chats = $state<Chat[]>([])

 
    async loadChat(){
        try{
            const response = await axios.get("/api/chat");
            for(let i in response.data){
                const chat = response.data[i] as Chat
                if(!this.chats.find(obj=>obj.id===chat.id)){
                    this.chats.push(chat)
                }
            }
        }
        catch(err){
            const error = err as any
            signal.send("openFailed",{mensagem:error.response.data.message,tipo:"aviso"})
        }
    } 

    getPesquisa(pesquisa:string): Chat[]{
        return this.chats.filter((obj)=>obj.nome.toLowerCase().includes(pesquisa.toLowerCase()))
    }

    async novoChat(nome:string){
        const response = await axios.post("/api/chat",{nome:nome})
        await this.loadChat()
        goto("/chat/"+response.data.id)
    }

    organizarMensagensDocumentos(input:string,files:FileData[]):string{
        if(files.length===0) return input

        let content = "\n\nHere are some documents converted into text for you:\n";
        for(let i in files){
            content+="\n - - - - - -  Start File  - - - - - - "
            content+= files[i].content
            content+="\n- - - - - -   End File - - - - - - "
        }
        return content

    }

    contextoChat(idChat:number){
        const chat = JSON.parse(JSON.stringify(this.chats.find((obj)=>obj.id===idChat)));   
        if(!chat) return
        return chat
    }

    async enviar(input:string,idChat:number,modelo:string,filesD:FileData[],controller:AbortController){    
        try{
            const chat = this.chats.find((obj)=>obj.id===idChat)
            if(!chat) return
            chat.mensagens.push({
                        conteudo:input,
                        atualizadoEm: new Date(),
                        criadoEm: new Date(),
                        id:-1,
                        idChat:idChat,
                        modelo:modelo,
                        bot:false,
                        arquivos: filesD ? filesD.map((obj)=>{return{nome:obj.name,content:this.organizarMensagensDocumentos(input,filesD)}}) : []
            })
            chat.thinking=true


            const body = {
                mensagem: input,
                idChat: idChat,
                modelo: modelo,
                chatContext: this.contextoChat(idChat),
                files:filesD
            }
            const response = await axios.post("/api/mensagem",body,
                {
                    signal:controller.signal
                }
            )
            chat.mensagens = chat.mensagens.map((obj,i)=>{
                if(obj.id===-1){
                    obj.id=response.data.mensagemUsuario.id
                }
                return obj
            })
            chat.mensagens.push({
                    conteudo:response.data.iaResponse.message.content.replace(/<|start_header_id|>[\s\S]*?<|end_header_id|>\n?/g, ''),
                    atualizadoEm: new Date(),
                    criadoEm: new Date(),
                    id:response.data.iaResponse.id,
                    modelo:modelo,
                    idChat:idChat,
                    bot:true,
                    eval_count:response.data.iaResponse.eval_count,
                    eval_duration: response.data.iaResponse.eval_duration,
                    load_duration: response.data.iaResponse.load_duration,
                    prompt_eval_count: response.data.iaResponse.prompt_eval_count,
                    prompt_eval_duration: response.data.iaResponse.prompt_eval_duration,
                    total_duration: response.data.iaResponse.total_duration
            })

            
        }
        catch(err:any){
            // this.removerUltima(idChat)
            if(!err.response){
                if(err.message==="canceled"){
                    return
                }
            }
            const error = err.response.data.error
            if(error.includes("model")){
                signal.send("openFailed",{mensagem:mensagemModel(modelo)})
                return
            }
            signal.send("openFailed",{mensagem:error})
        }

        finally{
            this.chats = this.chats.map((obj,i)=>{
                if(obj.id===idChat){
                    obj.thinking=false
                }
                return obj
            })
        }
    }

    removerUltima(idChat:number){
        this.chats[idChat].mensagens.pop()
    }
}




const data = new Data()
export default data



const mensagemModel = (model:string) => {
    return `The model you trying to chat is not avaliable in your machine, please pull the model <b>${model}</b> following this instructions:
<a href="https://github.com/ollama/ollama" class="text-blue-600 underline hover:text-purple-600" target="_blank">Ollama</a>`
}
