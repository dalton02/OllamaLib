<script lang="ts">
	import signal from "$lib/signal.svelte";


	import PopUp from "../modal/PopUp.svelte";
	import Logo from "../svg/Logo.svelte";

    let isVisible = $state<boolean>(false)
    let tipo = $state<string>("")
    let mensagem = $state<string>("")

    $effect(()=>{
        if(signal.state.signal==="openFailed"){
            tipo = signal.state.data.tipo
            mensagem = signal.state.data.mensagem;
            isVisible=true
            signal.reset()
        }
    })
</script>




<PopUp bind:isVisible={isVisible}>
    <div class="flex flex-col items-center justify-center w-[560px] bg-slate-50 rounded-2xl px-14 p-6">

        <h2 class="text-[26px] text-center justify-center font-semibold text-zinc-900 mb-2">Oops.... Something went wrong</h2>
        

        <div class="flex justify-center gap-6 mt-4 items-center">
            <Logo fill="black" width="34"/>   

            <p class="text-[18px]">
                {#if tipo==="model"}
                    The model you trying to chat is not avaliable in your machine, please pull the model <b>{mensagem}</b> following this instructions:
                    <a href="https://github.com/ollama/ollama" class="text-blue-600 underline hover:text-purple-600" target="_blank">Ollama</a>
                {:else if tipo==="aviso"}
                    {mensagem}
                {/if}
            </p>
        </div>
        <button class="text-[18px] mt-4 p-1 px-8 hover:bg-red-800 bg-red-700 text-white rounded-lg" onclick={()=>isVisible=false}>
            Go Back
        </button>
    </div>
</PopUp>
