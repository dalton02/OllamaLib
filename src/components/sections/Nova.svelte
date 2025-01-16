<script lang="ts">
	import data from "$lib/data.svelte";
	import signal from "$lib/signal.svelte";


	import PopUp from "../modal/PopUp.svelte";

    let novaConversa = $state<boolean>(false)
    let chatNome = $state<string>("")
    function novoChat(){
        if(chatNome.length===0){
            return;
        }
        data.novoChat(chatNome);
        chatNome=""
        novaConversa=false
    }
    $effect(()=>{
        if(signal.state.signal==="openNovaConversa"){
            novaConversa=true
            signal.reset()
        }
    })
</script>

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