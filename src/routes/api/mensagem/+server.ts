
import type { Mensagem } from "$lib";
import {prisma} from "$lib/server/prisma.js"
import ollama from "ollama"
export const POST =  async ({request}) => {
    if(!request.body)
        return new Response(null,{status:404});

    const body = await request.json()
 
    


    try{
        const iaResponse = await ollama.chat({
            model:body.modelo,
            stream:false,
            messages:body.chatContext.mensagens.map((obj:Mensagem)=> {
                if(obj.bot) {
                    return{
                        role: "assistant",
                        content:obj.conteudo
                    }
                }
                if(obj.arquivos){
                    return{
                        role:"user",
                        content:obj.conteudo+obj.arquivos.map((obj)=>{
                            return obj.content
                        })
                    }
                }
                return{
                    role: "user",
                    content:obj.conteudo
                }
            }),
        })
        const mensagemUsuario = await prisma.mensagem.create({
            data:{
                conteudo:body.mensagem,
                bot:false,
                idChat: body.idChat,
                modelo: body.modelo,
            },
            select:{
                id:true
            }
        })

        const salvandoIa = await prisma.mensagem.create({
            data:{
                modelo: body.modelo,
                conteudo: iaResponse.message.content.replace(/<start header>[\s\S]*?<end header>\n?/g, ''),
                bot:true,
                idChat: body.idChat,
                eval_count:iaResponse.eval_count,
                eval_duration: iaResponse.eval_duration,
                load_duration: iaResponse.load_duration,
                prompt_eval_count: iaResponse.prompt_eval_count,
                prompt_eval_duration: iaResponse.prompt_eval_duration,
                total_duration: iaResponse.total_duration
            },
            select:{
                id:true
            }
        })

        body.files.forEach((file:any)=>{
                    salvarArquivo(file.name,file.mime,mensagemUsuario.id)
        })
        return new Response(JSON.stringify({iaResponse:{...iaResponse,...salvandoIa},mensagemUsuario}),{status:200})
    }
    catch(err){
        return new Response(JSON.stringify(err),{status:404})
    }
}



async function salvarArquivo(fileName:string,content:string,idMensagem:number){
    const novoArquivo  = await prisma.arquivo.create({
        data:{
            idMensagem:idMensagem,
            data: content,
            nome: fileName
        }
    })
    return novoArquivo
}


function extractFileNameFromBase64(data64: string): string {
    const mimeMatch = data64.match(/data:([^;]+);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : "unknown";
    return `file.${mimeType.split('/')[1] || 'txt'}`;
}