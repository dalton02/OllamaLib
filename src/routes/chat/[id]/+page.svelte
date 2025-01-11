<script lang="ts">
	import data from "$lib/data.svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import type { Chat, FileData } from "$lib";
	import Models from "../../../components/sections/Models.svelte";

	import Mensagens from "../../../components/sections/Mensagens.svelte";
	import ControlField from "../../../components/sections/ControlField.svelte";
    

    let conversaAtual = $state<number>()
    let modelo = $state<"llama3.2:1b"| "llama3.2">("llama3.2:1b")
    let chatAtual = $state<Chat>()
    //Dependencias

    $effect(()=>{
        if(page.url.pathname || data.chats){
            mountChat()
        }
    })

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
    <div class="flex flex-col h-screen max-h-screen w-screen">

        <div class="flex z-10 items-center justify-start absolute pointer-events-auto p-2  px-32 left-0 w-full" >
            <div class="flex  ">
                <Models bind:modelo/>
           </div>

            <h2 class="text-[28px] font-semibold p-4 ">Chat: {chatAtual.nome}</h2>
            
        </div>
        <div class="flex flex-col  pb-4 justify-between relative h-full pt-20 pl-[260px] pr-32 w-full">
            <Mensagens chatAtual={chatAtual}/>
            <ControlField conversaAtual={conversaAtual} chatAtual={chatAtual} modelo={modelo}/>
        </div>
    </div>
{/if}
