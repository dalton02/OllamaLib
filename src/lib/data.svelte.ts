import { goto } from "$app/navigation";
import type { Chat, FileData } from "$lib"
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
            console.log(this.chats)
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
        //Chore: botar de um jeito maneiro os conteudos de cada arquivo em um markdown be, massa
        return input
    }

    async enviar(input:string,idChat:number,modelo:string,filesD:FileData[]){    
        try{
            this.chats = this.chats.map((obj,i)=>{
                if(obj.id===idChat){
                    obj.mensagens.push({
                        conteudo:input,
                        atualizadoEm: new Date(),
                        criadoEm: new Date(),
                        id:-1,
                        idChat:idChat,
                        modelo:modelo,
                        bot:false,
                        arquivos: filesD ? filesD.map((obj)=>{return{nome:obj.name,url:""}}) : []
                    })
                    obj.thinking=true;
                }
                return obj
            })

            const body = {
                mensagem: this.organizarMensagensDocumentos(input,filesD),
                idChat: idChat,
                modelo: modelo,
                chatContext: this.chats.find((obj)=>obj.id===idChat),
                files:[]
            }
            const response = await axios.post("/api/mensagem", body)

            this.chats = this.chats.map((obj:Chat,i)=>{
                if(obj.id===idChat){
                    obj.mensagens.push({
                        conteudo:response.data.message.content.replace(/<|start_header_id|>[\s\S]*?<|end_header_id|>\n?/g, ''),
                        atualizadoEm: new Date(),
                        criadoEm: new Date(),
                        id:-1,
                        modelo:modelo,
                        idChat:idChat,
                        bot:true,
                        eval_count:response.data.eval_count,
                        eval_duration: response.data.eval_duration,
                        load_duration: response.data.load_duration,
                        prompt_eval_count: response.data.prompt_eval_count,
                        prompt_eval_duration: response.data.prompt_eval_duration,
                        total_duration: response.data.total_duration
                    })
                }
                return obj
            })
        }catch(err){
            signal.send("openFailed",{mensagem:modelo,tipo:"model"})
        }
        this.chats = this.chats.map((obj,i)=>{
            if(obj.id===idChat){
                obj.thinking=false
            }
            return obj
        })
    }
}

const data = new Data()
export default data