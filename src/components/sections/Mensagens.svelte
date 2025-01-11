<script lang="ts">
	import type { Chat } from "$lib";
	import { expoOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import Logo from "../svg/Logo.svelte";
	import { marked } from "marked";
	import Thinking from "../svg/Thinking.svelte";
	import data from "$lib/data.svelte";


    let {chatAtual}:{chatAtual:Chat} = $props()

    let containerChat = $state<HTMLDivElement>()

    function goBottom(){
        setTimeout(()=>containerChat?.scrollTo({
                    top:99999999999999999999999999999999999999,
                    behavior:"smooth"
        }),100)
    }
    
    $effect(()=>{
        if(data.chats && containerChat){
            goBottom()
        }
    })

</script>

<div class="flex flex-col scroll-padrao px-2 pb-12 py-3 gap-5 overflow-x-hidden overflow-y-auto h-full  w-full " bind:this={containerChat}>
    {#each chatAtual.mensagens as mensagem,i (mensagem) }

            {#if mensagem.bot}
                <div class="flex flex-row gap-2 items-center"
                in:fly|global={{x:-500,easing:expoOut,duration:1200}}
                out:fly|global={{x:-500,easing:expoOut,duration:600}}
                >
                    <div class="p-3 rounded-full shadow-md self-end flex items-center justify-center w-12 h-12 aspect-square bg-white">
                        <Logo width="18" fill="black"/>
                    </div>
                    <div class="mr-auto overflow-hidden whitespace-normal shadow-sm flex max-w-[80%] flex-col gap-2 rounded-r-md rounded-tl-md bg-neutral-50 p-4 text-neutral-600 md:max-w-[60%] dark:bg-neutral-900 dark:text-neutral-300">
                         {@html marked.parse(mensagem.conteudo)}
                    </div>
                </div>
            {:else}
                <div class="ml-auto flex max-w-[80%] shadow-md flex-col gap-2 rounded-l-xl rounded-tr-xl bg-black p-4 text-[16px] text-neutral-100
                 md:max-w-[60%] dark:bg-white dark:text-black relative" 
                 in:fly|global={{x:500,easing:expoOut,duration:1200}}
                 out:fly|global={{x:500,easing:expoOut,duration:600}}>
                 {#if mensagem.arquivos}
                    {#each mensagem.arquivos}
                         <div class="absolute whitespace-nowrap flex gap-1 items-center  top-[-30px] left-[-20px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" class=" rounded-lg" fill="black" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path></svg>
                            {mensagem.arquivos.length} file(s)
                         </div>
                    {/each}
                 {/if}  
                 {mensagem.conteudo}
                </div>
            {/if}

    {/each}
    {#if chatAtual.thinking}
        <div class="flex flex-row gap-2 items-center"   
        in:fly|global={{x:-500,easing:expoOut,duration:1200}}
        out:fly|global={{x:-500,easing:expoOut,duration:600}}>
            <div class="p-3 rounded-full shadow-md self-end flex items-center justify-center w-12 h-12 aspect-square bg-white">
                <Logo width="18" fill="black"/>
            </div>
            <div class="bg-green-700 p-2 flex items-center justify-center rounded-full">
                <Thinking/>
            </div>
        </div>
    {/if}
</div>
