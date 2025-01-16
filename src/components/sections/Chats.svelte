<script lang="ts">
	import { goto } from "$app/navigation";
	import data from "$lib/data.svelte";
	import handleDate from "$lib/sanitizers/time";
	import signal from "$lib/signal.svelte";
	import { fly, slide, type TransitionConfig } from "svelte/transition";

	import PopUp from "../modal/PopUp.svelte";
	import Logo from "../svg/Logo.svelte";
	import { circInOut, cubicInOut, elasticInOut, expoInOut, quadInOut, quartInOut, sineInOut } from "svelte/easing";
	import { flySlide } from "$lib/anim";
	import axios from "axios";
	import { page } from "$app/state";

    let pesquisaChats = $state<string>("")
    let isVisible = $state<boolean>(false)

    function delChat(id:number){
        data.chats = data.chats.filter((obj)=>obj.id!==id)
        axios.delete("/api/chat",{
            data:{
                id
            }
        })
        if(page.url.pathname.split("/")[2]===id.toString()){
            goto("/")
        }
    }


    $effect(()=>{
        if(signal.state.signal==="openChats"){
            isVisible=true
            signal.reset()
        }
    })

   

</script>

<PopUp bind:isVisible>
    <div class="flex flex-col items-start w-[500px] bg-white rounded-2xl p-8 ">

        <div class="flex justify-center mb-8 relative w-full">
            <h2 class="text-[42px] leading-10 text-center">Find your conversations</h2>
        </div>
        
        <input type="text" bind:value={pesquisaChats} placeholder="Search for your chat" 
        class="p-1 px-3 mb-4 outline-none border w-full rounded-md text-[18px] invalid:border-gray-400 border-gray-800 bg-white" required/>

        <div class="flex flex-col items-start w-full justify-start mt-2 mb-1 relative  px-4 max-h-[350px] scroll-padrao overflow-x-hidden overflow-y-auto">
            {#if data.getPesquisa(pesquisaChats).length===0}
                <span class="text-[18px] mb-2">Not able to found any chats</span>
            {/if}
            
            {#each data.getPesquisa(pesquisaChats) as chat,i (chat.id)}
            {@const duration = 400}
            {@const delay=100}
            {@const y = 80}
            {@const x = 500}
            {@const easing = quadInOut}
                <div out:flySlide={{duration:700,easing:quartInOut}} in:flySlide={{duration:700,easing:cubicInOut}}
                class="{!chat.openMenu && "hover:bg-[#f0f0f0]"} relative flex items-start flex-shrink-0 overflow-hidden my-2 
                h-[70px] justify-start border rounded-lg  bg-white p-1 px-5 w-full pointer-events-none" >
                    {#if !chat.openMenu}
                    <button   oncontextmenu={(event)=>{event.preventDefault();chat.openMenu=true}}
                    onclick={()=>{goto("/chat/"+chat.id,{replaceState:true});isVisible=false}} 
                    class="pointer-events-auto flex items-center gap-4  cursor-default w-full  duration-500 ease-in-out absolute h-full top-0 left-0 mx-3  rounded-lg"
                    in:fly={{x,duration,delay,easing}} out:fly={{y,duration,delay,easing}}>
                        <Logo width="18" fill="black"/>
                        <div class="flex flex-col overflow-hidden">
                            <b class="text-[20px] w-[240px] text-left truncate overflow-clip" title={chat.nome}>{chat.nome}</b>
                            <span class="text-[16px] w-[340px] text-left truncate overflow-clip">
                                {chat.mensagens.find((_,i)=>i===chat.mensagens.length-1) ? chat.mensagens.find((_,i)=>i===chat.mensagens.length-1)?.conteudo.trim() : "No messages found"}
                            </span>
                        </div>
                        <span class="absolute text-[14px] top-[10px] right-[20px]">{handleDate.formatRelativeDate(chat.atualizadoEm)}</span>
                    </button>
                    {:else}
                    <div class="flex w-full flex-shrink-0 min-w-full absolute h-full top-0 left-0 mx-3  flex-col items-center justify-center" 
                    in:fly={{x,duration,delay,easing}} out:fly={{y,duration,delay,easing}} >
                        <span class="text-[20px] pointer-events-auto">Delete chat?</span>
                        <div class="flex justify-center items-center gap-4">
                            <button class="pointer-events-auto text-[16px] p-[2px] px-4 bg-red-700 hover:bg-red-800 ease-in-out duration-300 text-white rounded-lg" 
                            onclick={()=>{chat.openMenu=false;delChat(chat.id)}}>
                                Yes, i'm sure
                            </button>
                            <button class="pointer-events-auto text-[16px] hover:bg-neutral-50 ease-in-out duration-300 p-[2px] px-4 border rounded-lg" onclick={()=>chat.openMenu=false}>
                                No, go back
                            </button>
                        </div>
                    </div>
                    {/if}
                </div>
            {/each} 

       </div>
        <button onclick={()=>{isVisible=false;signal.send("openNovaConversa")}} class="flex items-center relative duration-500 mt-3 group ease-in-out cursor-pointer 
            rounded-full gap-1 font-semibold text-[20px] ">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" class="translate-y-[1px] group-hover:rotate-180 duration-300 ease-in-out" 
            fill="#000000" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z">
                </path>
            </svg> 
            Create Chat
        </button>
    </div>
</PopUp>
