<script lang="ts">
	import data from "$lib/data.svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import type { Chat, FileData } from "$lib";
	import Models from "../../../components/sections/Models.svelte";

	import Mensagens from "../../../components/sections/Mensagens.svelte";
	import ControlField from "../../../components/sections/ControlField.svelte";
	import axios from "axios";
    

    let conversaAtual = $state<number>()
    let modelo = $state<"llama3.2:1b"| "llama3.2">("llama3.2:1b")
    let chatAtual = $state<Chat>()
    //Dependencias

    $effect(()=>{
        if(page.url.pathname || data.chats){
            mountChat()
        }
    })


    $effect(()=>{
        if(chatAtual)
            updateChatName(chatAtual.nome)
    })


    let updater:NodeJS.Timeout;

    function updateChatName(name:string){
        if(updater){
            clearTimeout(updater)
        }
        updater = setTimeout(async()=>{
            if(!chatAtual) return
            const r = await axios.put("/api/chat",{nome:name,id:chatAtual.id})
        },700)

    }

    async function mountChat(){
        await data.loadChat()
        conversaAtual = parseInt(page.url.pathname.split("/")[2])
        chatAtual = data.chats.find((obj)=>obj.id===conversaAtual);
        if(!chatAtual){
            goto("/")
        }
    }



</script>

{#if conversaAtual && chatAtual}
    <div class="flex flex-col justify-start items-start h-screen max-h-screen w-screen">

        <div class="flex z-10 items-center justify-start absolute pointer-events-auto  p-2 pl-[100px] pr-0  xl:pr-12 xl:pl-[180px] left-0 w-full" >
            <div class="flex  ">
                <Models bind:modelo/>
           </div>

            <div class="text-[28px] font-semibold p-4 w-full whitespace-nowrap">
                Chat: 
                <input type="text" bind:value={chatAtual.nome} class="bg-transparent focus:bg-white outline-neutral-900 
                focus:indent-4 duration-300 ease-in-out p-1 px-0"/>
            </div>
            
        </div>
        <div class="flex flex-col  justify-between relative h-full w-full
        pt-20 xl:pl-[188px] pl-[100px] pr-7 xl:pr-20 ">
            <Mensagens chatAtual={chatAtual}/>
            <ControlField conversaAtual={conversaAtual} chatAtual={chatAtual} modelo={modelo}/>
        </div>
    </div>
{/if}
