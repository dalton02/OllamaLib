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
	import Chats from "../components/sections/Chats.svelte";
	import Nova from "../components/sections/Nova.svelte";
	import LayoutToast from "../components/assets/toast/LayoutToast.svelte";

    onMount(()=>{
        data.loadChat()
        console.log("%cTem nada aqui não curioso :)", "color: red; font-size: 32px; font-weight: bold;");

    })

 

</script>

<Failed/>
<Statistics/>
<Nova/>
<Chats/>


<LayoutToast/>


<div class="w-auto z-20 rounded-r-xl bg-[#fcfcfc] shadow-[10px_5px_30px_rgba(0,0,0,.1)] h-screen absolute pointer-events-none p-5 flex flex-col items-center justify-between">
    
    <TitleBlock title="Ollama" className="" >
        <a href="https://ollama.com/download" target="_blank">
          <Logo fill="black" width="20"/>
        </a>
    </TitleBlock>
    <div class="flex w-full items-end justify-between">
        <div class="flex flex-col gap-6 ">

            <TitleBlock title="New chat"  className="" >
                <button aria-label="New" onclick={()=>signal.send("openNovaConversa")} class="group-hover:bg-gray-50 outline-none p-2 bg-white rounded-full aspect-square 
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
                <button aria-label="Chats" onclick={()=>signal.send("openChats")} class="group-hover:bg-[#997daf] outline-none p-2 bg-[#715c81] rounded-full 
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

<div class="w-screen h-screen flex flex-col items-center justify-center gradient overflow-hidden">
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