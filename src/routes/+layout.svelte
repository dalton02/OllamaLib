<script lang="ts">
	import { goto } from "$app/navigation";
	import data from "$lib/data.svelte";
	import handleDate from "$lib/sanitizers/time";
	import signal from "$lib/signal.svelte";
	import { onMount } from "svelte";
    import "../app.css"
	import TitleBlock from "../components/lego/TitleBlock.svelte";
	import PopUp from "../components/modal/PopUp.svelte";
	import Failed from "../components/sections/Failed.svelte";
	import Logo from "../components/svg/Logo.svelte";
	import { page } from "$app/state";
	import Statistics from "../components/sections/Statistics.svelte";

    let openMenu = $state<boolean>(false)
    let novaConversa = $state<boolean>(false)
    let chatNome = $state<string>("")
    let pesquisaChats = $state<string>("")

    function novoChat(){
        if(chatNome.length===0){
            return;
        }
        data.novoChat(chatNome);
        chatNome=""
        novaConversa=false
    }

    onMount(()=>{
        data.loadChat()
    })

    $effect(()=>{
        if(signal.state.signal==="openNovaConversa"){
            novaConversa=true
            signal.reset()
        }
    })

</script>

<Failed/>
<Statistics/>
<PopUp bind:isVisible={novaConversa}>
    <div class="flex flex-col items-center justify-center bg-white rounded-2xl w-[450px] relative p-8 ">

        <div class="flex justify-center mb-3 relative">
            <h2 class="text-[42px] leading-10 text-center">Let's create a new conversation</h2>
        </div>
        <div class="flex flex-col w-full gap-1 mb-2">
            <label for="conversa" class="text-[20px] font-semibold text-gray-800">Name:</label>
            <input type="text" bind:value={chatNome} name="conversa" placeholder="ex: Organizing my routine" 
            class="p-1 text-[18px] outline-none border-b  invalid:border-gray-400 border-gray-800 pl-2
             font-medium" required>
        </div>
        <div class="flex justify-center w-full">
                <button onclick={novoChat} class=" text-center flex items-center justify-center self-center
                text-white bg-neutral-950 hover:bg-[#EBEBEB] hover:text-neutral-950 p-2 
                relative duration-500 mt-3 group ease-in-out cursor-pointer rounded-xl gap-1 font-semibold text-[18px] w-full">
                    Continue
                </button>
        </div>
    </div>
</PopUp>


<PopUp bind:isVisible={openMenu}>
    <div class="flex flex-col items-start w-[500px] bg-white rounded-2xl p-8 ">

        <div class="flex justify-center mb-8 relative w-full">
            <h2 class="text-[42px] leading-10 text-center">Find your conversations</h2>
        </div>
        
        <input type="text" bind:value={pesquisaChats} placeholder="Search for your chat" 
        class="p-1 px-3 mb-4 outline-none border w-full rounded-md text-[18px] invalid:border-gray-400 border-gray-800 bg-white" required/>

        <div class="flex flex-col items-start w-full justify-start gap-2 mt-2 mb-1 max-h-[350px] scroll-padrao overflow-y-auto">
            {#if data.getPesquisa(pesquisaChats).length===0}
                <span class="text-[18px] mb-2">Not able to found any chats</span>
            {/if}
            {#each data.getPesquisa(pesquisaChats) as chat}
                <button onclick={()=>{goto("/chat/"+chat.id,{replaceState:true});openMenu=false}} class="flex items-center relative hover:bg-[#f0f0f0] bg-white border duration-500 ease-in-out cursor-pointer rounded-lg gap-4 p-2 px-4 w-full">
                    <Logo width="18" fill="black"/>
                    <div class="flex flex-col overflow-hidden">
                        <b class="text-[20px] w-[240px] text-left truncate overflow-clip" title={chat.nome}>{chat.nome}</b>
                        <span class="text-[16px] w-[340px] text-left truncate overflow-clip">
                            {chat.mensagens.find((_,i)=>i===chat.mensagens.length-1) ? chat.mensagens.find((_,i)=>i===chat.mensagens.length-1)?.conteudo.trim() : "No messages found"}
                        </span>
                    </div>
                    <span class="absolute text-[14px] top-[10px] right-[20px]">{handleDate.formatRelativeDate(chat.atualizadoEm)}</span>
                </button>
            {/each} 
       </div>
        <button onclick={()=>{openMenu=false;novaConversa=true}} class="flex items-center relative duration-500 mt-3 group ease-in-out cursor-pointer 
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





<div class="w-auto z-20 rounded-r-xl bg-[#fcfcfc] shadow-[10px_5px_30px_rgba(0,0,0,.1)] h-screen absolute pointer-events-none p-5 flex flex-col items-center justify-between">
    
    <TitleBlock title="Ollama" className="" >
        <a href="https://ollama.com/download" target="_blank">
          <Logo fill="black" width="20"/>
        </a>
    </TitleBlock>
    <div class="flex w-full items-end justify-between">
        <div class="flex flex-col gap-6 ">

            <TitleBlock title="New chat"  className="" >
                <button aria-label="New" onclick={()=>novaConversa=true} class="group-hover:bg-gray-50 outline-none p-2 bg-white rounded-full aspect-square 
                    pointer-events-auto icon-shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" class="group-hover:rotate-180 duration-500 ease-in-out" fill="black" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                    </svg>
                </button>
            </TitleBlock>
            {#if page.url.pathname.includes("/chat")}
            <TitleBlock title="Statistics" className="">
                <button aria-label="Chats" onclick={()=>signal.send("openStatistics",{})} 
                    class="outline-none p-2 bg-[#005BA4] group-hover:bg-[#3385AB] rounded-full 
                    aspect-square pointer-events-auto icon-shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" fill="#f7f7f7" viewBox="0 0 256 256"><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path></svg>
                </button>
            </TitleBlock>
            {/if}    
            <TitleBlock title="Chats"  className="" >
                <button aria-label="Chats" onclick={()=>openMenu=true} class="group-hover:bg-[#997daf] outline-none p-2 bg-[#715c81] rounded-full 
                    aspect-square pointer-events-auto icon-shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" fill="#f7f7f7" viewBox="0 0 256 256">
                        <path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm-72,96H104a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm72-56H32V64H224V88Z">
                        </path>
                    </svg>
                </button>
            </TitleBlock>
        </div>
    </div>
</div>

<div class="w-screen h-screen flex flex-col items-center justify-center gradient">
    <slot/>
</div>

<style>

  .gradient {
  background:#EEEEEE;
}
    .icon-shadow{
        box-shadow: 2px 4px 14px rgba(0,0,0,.4);
    }
</style>