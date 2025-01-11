import { request } from "http";
import {prisma} from "$lib/server/prisma.js"
import { randomUUID } from "crypto";

export const GET = async({request}) => {
    try{
    const chat = await prisma.chat.findMany({
        select:{
            id:true,
            nome:true,
            uuid:true,
            atualizadoEm:true,
            criadoEm:true,
            mensagens:{
                select:{
                    arquivos:true,
                    id:true,
                    conteudo:true,    
                    modelo:true,       
                    bot:true,          
                    eval_count :true,
                    eval_duration:true,
                    load_duration:true,
                    prompt_eval_count:true,
                    prompt_eval_duration:true,
                    total_duration:true,
                    criadoEm:true,
                    atualizadoEm:true,
                    idChat:true,   
                }
            },
        }
    })
    return new Response(JSON.stringify(chat,(_, v) => typeof v === 'bigint' ? v.toString() : v),{status:200})
    }catch(err){
        console.log(err)
        return new Response(JSON.stringify({
            message:"Failed to get chats in database, check if you have sqllite installed and type the command `npx prisma db push`"
        }),{status:500})
    }

}
export const POST = async({request}) => {

    const body = await request.json()
    const chat = await prisma.chat.create({
        data:{
            uuid: randomUUID(),
            nome:body.nome,
        },
        select:{
            id:true
        }
    })
    return new Response(JSON.stringify({id:chat.id}),{status:200})

}