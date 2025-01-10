<script lang="ts">
	import Logo from "../../../components/svg/Logo.svelte";
	import { onMount } from "svelte";
	import Thinking from "../../../components/svg/Thinking.svelte";
	import data from "$lib/data.svelte";
	import { fly, scale, slide } from "svelte/transition";
	import { expoOut } from "svelte/easing";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import type { Chat } from "$lib";
	import { marked } from "marked";
	import FocusBlock from "../../../components/lego/FocusBlock.svelte";
	import Models from "../../../components/sections/Models.svelte";

    interface FileData{
        file:File,
        data64:string
    }

    let containerChat = $state<HTMLDivElement>()
    let input = $state<string>("")
    let conversaAtual = $state<number>()
    let modelo = $state<"llama3.2:1b"| "llama3.2">("llama3.2:1b")
    let chatAtual = $state<Chat>()

    let imageRef = $state<HTMLInputElement>()
    let arquivoUpload = $state<FileData>()

    function resize(event:any){
        event.target.style.height = '45px';
        event.target.style.height = event.target.scrollHeight + 'px';
    }

    function uploadFile(event:any){
        const file = event.target.files[0]

        if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result as string;
            arquivoUpload = {
                file,
                data64:result
            }
        };
        reader.readAsDataURL(file);
    }

    }

    function keyDown(event:any){
        if(event.key==="Enter"){
            event.preventDefault()
            enviar()
        }
    }
    async function enviar(){  
        if(!conversaAtual) return  
        if(input.length===0) return
        data.enviar(input,conversaAtual,modelo)
        input=""
    }

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

{#if conversaAtual && chatAtual}


    <div class="flex flex-col h-screen max-h-screen w-screen">

        <div class="flex z-10 items-center justify-start absolute pointer-events-auto p-2  px-32 left-0 w-full" >
            <div class="flex  ">
                <Models bind:modelo/>
           </div>

            <h2 class="text-[28px] font-semibold p-4 ">Chat: {chatAtual.nome}</h2>
            
        </div>
        <div class="flex flex-col  pb-4 justify-between relative h-full pt-20 pl-[260px] pr-32 w-full">

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
                         md:max-w-[60%] dark:bg-white dark:text-black" 
                         in:fly|global={{x:500,easing:expoOut,duration:1200}}
                         out:fly|global={{x:500,easing:expoOut,duration:600}}>
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
            <div class="flex flex-col gap-3 w-full relative items-center">

                <div class="flex flex-col p-3 pt-2 pb-2 px-3 gap-2 w-full rounded-3xl bg-white shadow-md">
                    <img src="https://imgs.search.brave.com/CtQgmcFNViqJQzoCI2XoPXDeDBkl02w04FmvCDxZkHI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMw/Nzc1MDU5OS9waG90/by9wdXBweS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9TUR6/TlBIaUlHTV9JM0M3/VHdnV0tuclowVGpN/X3o5dVBUcFZmdWpq/eDdmbz0"
                    class="w-40 ml-3 overflow-hidden rounded-lg" alt="">
                    <textarea disabled={chatAtual.thinking} name="mensagem" onkeydown={keyDown} oninput={resize} class="w-full h-[45px] text-[18px] font-medium scroll-padrao resize-none flex-grow max-h-[120px] 
                    pt-2 bg-transparent border-none outline-none pl-4" placeholder="I have some ideas, can you digest for me?" bind:value={input}></textarea>
                    {@render botoes()}
                </div>
            </div>
        </div>
    </div>
{/if}


<input type="file" onchange={uploadFile} accept="" bind:this={imageRef} class="hidden"/>



{#snippet botoes()}

<div class="flex gap-2 justify-end items-center">

    <button onclick={()=>imageRef?.click()} class="flex group relative self-end flex-row btn-shadow items-center flex-shrink-0 flex-grow-0
        bg-[#000425] hover:bg-[#224363] p-[10px]
    hover:text-[#2d425e] text-[#516d91] ease-in-out duration-300 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" fill="white" viewBox="0 0 256 256"><path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path></svg>
        <span class="whitespace-nowrap w-0 group-hover:w-[80px] text-white text-[16px] translate-y-[-1px] font-semibold duration-300 motion-ease-spring-snappy overflow-hidden">
           Import file
        </span>
    </button>

    <button onclick={enviar} class="flex group relative self-end flex-row btn-shadow items-center flex-shrink-0 flex-grow-0
        bg-[#1D3E5E] hover:bg-[#516D91] p-[10px]
    hover:text-[#2d425e] text-[#516d91] ease-in-out duration-300 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" class="aspect-square"  fill="white" viewBox="0 0 256 256">
            <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z">
            </path>
        </svg>
        <span class="whitespace-nowrap w-0 group-hover:w-[100px] text-white text-[16px] translate-y-[-1px] font-semibold duration-300 motion-ease-spring-snappy overflow-hidden">Send message</span>
    </button>

</div>

{/snippet}