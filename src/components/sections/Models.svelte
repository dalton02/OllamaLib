<script lang="ts">

	import DropBlock from "../lego/DropBlock.svelte";
import FocusBlock from "../lego/FocusBlock.svelte";
	import Logo from "../svg/Logo.svelte";

    let {modelo= $bindable()} = $props()

    let isVisible = $state<boolean>(false)
    const modelos = [
    { value: "llama3.3", size: "43GB" },
    { value: "llama3.2", size: "2.0GB" },
    { value: "llama3.2:1b", size: "1.3GB" },
    { value: "llama3.2-vision", size: "7.9GB" },
    { value: "llama3.2-vision:90b", size: "55GB" },
    { value: "llama3.1", size: "4.7GB" },
    { value: "llama3.1:405b", size: "231GB" },
    { value: "phi3", size: "2.3GB" },
    { value: "phi3:medium", size: "7.9GB" },
    { value: "gemma2:2b", size: "1.6GB" },
    { value: "gemma2", size: "5.5GB" },
    { value: "gemma2:27b", size: "16GB" },
    { value: "mistral", size: "4.1GB" },
    { value: "moondream", size: "829MB" },
    { value: "neural-chat", size: "4.1GB" },
    { value: "starling-lm", size: "4.1GB" },
    { value: "codellama", size: "3.8GB" },
    { value: "llama2-uncensored", size: "3.8GB" },
    { value: "llava", size: "4.5GB" },
    { value: "solar", size: "6.1GB" }
    ];

    function select(value:string){
        modelo=value
    }
</script>

<FocusBlock bind:viewObject={isVisible} className=" relative pointer-events-auto  flex justify-center items-center" containersWithinFocus={[]}>

    <button class="self-end flex items-center text-[16px] gap-2 px-4 hover:bg-neutral-50 duration-150 whitespace-nowrap rounded-lg p-2 text-gray-900 " onclick={()=>isVisible=!isVisible}>
        <div class="flex flex-col items-start">
            <span class="text-[24px] leading-5 font-medium">Ollama</span>
            <b class="text-[16px] font-semibold text-gray-700">{modelo}</b> 
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" class=" {isVisible ? "" : "rotate-[180deg]"} ml-1 ease-in-out duration-500" fill="#0f0f0f" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path></svg>
    </button>
    <DropBlock isDrop={isVisible} className="absolute left-0 origin-bottom flex flex-col top-[100%] h-[300px]
    overflow-y-auto scroll-padrao 
     bg-gray-950 rounded-lg overflow-x-hidden">
        {#each modelos as model}
            <button onclick={()=>select(model.value)} class="flex flex-col text-left w-full text-[16px] whitespace-nowrap px-6 p-2 hover:bg-gray-800 text-white">
                <div class="flex gap-2 items-center">
                    {model.value}
                    {#if modelo===model.value}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" class="fill-green-700 " viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                    {/if}
                </div>
                <span class="text-[14px]">Model Size: <b>{model.size}</b></span>
            </button>    
        {/each}
    </DropBlock>
</FocusBlock>