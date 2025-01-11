
import type { Mensagem } from "$lib";
import {prisma} from "$lib/server/prisma.js"
import ollama from "ollama"
export const POST =  async ({request}) => {
    if(!request.body)
        return new Response(null,{status:404});

    const form = await request.formData()
   
    const body = {
        modelo: form.get("modelo")?.toString() ?? "",
        chatContext: JSON.parse(form.get("chatContext")?.toString() ?? ""),
        mensagem: form.get("mensagem")?.toString() ?? "",
        idChat: parseInt(form.get("idChat")?.toString() ?? "1"),
    }

    const files = form.getAll("files[]").filter((entry): entry is File => entry instanceof File);
    const data64 = form.getAll("data64[]").map((entry) => {
        if (typeof entry === "string") {
            return entry.toString();
        }
        return null; 
    }).filter((entry): entry is string => entry !== null);

    try{
        const iaPromisse = ollama.chat({
            model:body.modelo,
            stream:false,
            messages:body.chatContext.mensagens.map((obj:Mensagem)=> {
                if(obj.bot) {
                    return{
                        role: "assistant",
                        content:obj.conteudo
                    }
                }
                return{
                    role: "user",
                    content:obj.conteudo
                }
            }),
        })
        const mensagemPromisse = prisma.mensagem.create({
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

        const [iaResponse,mensagemUsuario] = await Promise.all([iaPromisse,mensagemPromisse]).then((values:any)=>{
            return values
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

        files.forEach((file,i)=>{
                    salvarArquivo(file.name,data64[i],mensagemUsuario.id)
        })
        return new Response(JSON.stringify(iaResponse),{status:200})
    }
    catch(err){
        return new Response(JSON.stringify(err),{status:404})
    }
}



async function salvarArquivo(fileName:string,data64:string,idMensagem:number){
    const novoArquivo  = await prisma.arquivo.create({
        data:{
            idMensagem:idMensagem,
            url: data64,
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