<script lang="ts">
	import type { Chat, FileData } from "$lib";
    import PizZip from "pizzip"
    import Docxtemplater from "docxtemplater"
	import data from "$lib/data.svelte";
	import { fly, scale,slide } from "svelte/transition";
	import TitleBlock from "../lego/TitleBlock.svelte";
	import Spinner from "../anim/Spinner.svelte";
	import signal from "$lib/signal.svelte";
	import { quadInOut } from "svelte/easing";
	import { flySlide } from "$lib/anim";

    const easing="[transition-timing-function:cubic-bezier(0.37,0,0.63,1)]"
    
    const controller = new AbortController()

    let {conversaAtual,chatAtual,modelo}:{conversaAtual:number,chatAtual:Chat,modelo:string} = $props()

    let arquivoUpload = $state<FileData[]>([])
    let input = $state<string>("")
    let imageRef = $state<HTMLInputElement>()
    let reRenderInput = $state<boolean>(false)
    
    function resize(event:any){
        event.target.style.height = '45px';
        event.target.style.height = event.target.scrollHeight + 'px';
    }

    async function uploadFile(event:any){
        
        const file = event.target.files[0] as File
        reRenderInput=true
        setTimeout(()=>{
            reRenderInput=false
        },30)
        if (file) {
       
        const index = arquivoUpload.push({
                content:"",
                name:file.name,
                mime: file.name.substring(file.name.lastIndexOf('.')+1, file.name.length) || file.name,
                loading:true,
                id: Math.random()*100000

         })

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);    
        reader.onload = (e: ProgressEvent<FileReader>) => {

            const result = e.target?.result as string;
            try{
            const zip = new PizZip(result);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const text = doc.getFullText();

            arquivoUpload[index-1].content = text;
            arquivoUpload[index-1].loading = false;
            }
            catch(err){

                arquivoUpload = arquivoUpload.filter((obj,i)=>i!==index-1)
                signal.send("openFailed",{
                    tipo:"aviso",
                    mensagem:"Ollama currently supports only .doc and related file formats, like Excel. Please upload a compatible file!"
                })
            }
        };
    
    }

    }
    function deleteFile(i:number){
        arquivoUpload = arquivoUpload.filter((obj,index)=>index!==i)
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
        if(arquivoUpload.find((obj)=>obj.loading)) return
        data.enviar(input,conversaAtual,modelo,arquivoUpload,controller)
        input=""
        arquivoUpload=[]
    }
</script>



<div class="flex flex-col gap-3 w-full relative items-center p-2 pb-4">
    {#if !chatAtual.thinking}
        <div class="flex flex-col items-end flex-shrink-0 p-3 overflow-hidden pt-2 pb-2 px-3 gap-2 w-full rounded-3xl bg-white shadow-md transition-all duration-300 ease-in-out"
        in:flySlide={{axis:"y",x:1000,y:100,duration:500,easing:quadInOut}} out:flySlide={{axis:"y",x:2000,y:0,duration:500,easing:quadInOut}}>
            <div class="flex gap-2 overflow-x-auto w-full scroll-padrao p-1 justify-start">
                {#each arquivoUpload as arquivo,i (arquivo.id)}
                    {@render arquivoMini(arquivo,i)}
                {/each}
            </div>
            <textarea disabled={chatAtual.thinking} name="mensagem" onkeydown={keyDown} oninput={resize} class="w-full h-[45px] text-[18px] font-medium scroll-padrao resize-none flex-grow max-h-[120px] 
            pt-0 bg-transparent border-none outline-none pl-4" placeholder="I have some ideas, can you digest for me?" bind:value={input}></textarea>
            {@render botoes()}
        </div>
    {/if}
</div>


{#if !reRenderInput}
    <input type="file" onchange={uploadFile} accept=".doc,.docx,.xls,.xlsx"  bind:this={imageRef} class="hidden"/>
{/if}


{#snippet arquivoMini(arquivo:FileData,i:number)}
     <div class="flex gap-2 pr-20 m-2 mb-0 items-center relative p-2 rounded-lg bg-neutral-900"
     transition:scale>
         <div class="relative p-[6px] {arquivo.loading ?? "bg-neutral-700"} rounded-lg">
             {#if arquivo.loading}
                     <Spinner width={20}  className="b"/>
             {:else}
                     <svg xmlns="http://www.w3.org/2000/svg" width="30" fill="white" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path></svg>
             {/if}
         </div>  
         <div class="text-white flex flex-col gap-0 leading-5">
             {arquivo.name}
             <span class="text-neutral-300">{arquivo.mime.toUpperCase()}</span>
         </div>
         <div class="absolute right-[-8px] top-[-6px]">  
             <TitleBlock title="Delete file" className="" padrao={1} classPosTitle="top-[-5px] w-[67px] left-[25px]">
                 <button aria-label="Delete file" class="bg-white border border-neutral-300 p-1 rounded-full" onclick={()=>deleteFile(i)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                 </button>
             </TitleBlock>
         </div>
     </div>
{/snippet}






{#snippet botoes()}

<div class="flex gap-2 justify-end items-center">

    <button onclick={()=>imageRef?.click()} class="flex group relative self-end flex-row btn-shadow items-center flex-shrink-0 flex-grow-0
    p-[10px]
    hover:text-[#2d425e] text-[#516d91] {easing} duration-500 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" class=" duration-500 {easing} group-hover:rotate-[-30deg]" fill="#1D3E5E" viewBox="0 0 256 256"><path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path></svg>
        <span class="whitespace-nowrap w-0 group-hover:w-[70px] text-[#1D3E5E] text-[16px] translate-y-[-1px] font-semibold duration-500 motion-ease-spring-snappy overflow-hidden">
        Import file
        </span>
    </button>

    <button onclick={enviar} class="flex group relative self-end flex-row btn-shadow items-center flex-shrink-0 flex-grow-0
        bg-[#1D3E5E]  p-[9px]
    hover:text-[#2d425e] text-[#516d91]{easing} duration-500 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" class="aspect-square group-hover:rotate-[40deg] group-hover:scale-[0.9] duration-500 {easing}"  fill="white" viewBox="0 0 256 256">
            <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z">
            </path>
        </svg>
        <span class="whitespace-nowrap w-0 group-hover:w-[100px] leading-3 text-white text-[16px] translate-y-[-1px] font-semibold duration-500 motion-ease-spring-snappy overflow-hidden">Send message</span>
    </button>


</div>

{/snippet}