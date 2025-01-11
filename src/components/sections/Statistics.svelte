<script lang="ts">
	import { page } from "$app/state";
	import type { Chat } from "$lib";
	import data from "$lib/data.svelte";
	import handleDate from "$lib/sanitizers/time";
	import signal from "$lib/signal.svelte";
	import NumberCount from "../anim/NumberCount.svelte";
	import PopUp from "../modal/PopUp.svelte";
	import AreaGraph from "./graphs/AreaGraph/AreaGraph.svelte";
	import MultiGraph from "./graphs/MultiGraph/MultiGraph.svelte";
	import MultiLine from "./graphs/MultiGraph/MultiLine.svelte";


    let isVisible = $state<boolean>(false)
    let chatEstatisticas = $state<Chat>()

        chatEstatisticas = data.chats.find((obj)=>obj.id===2);
    let mediaTempoGeral = $derived.by<{myX:string,myY:number}[]>(()=>{
        if(!chatEstatisticas) return []
        let index=0;
        return chatEstatisticas.mensagens.filter(obj=> obj.eval_duration).map((obj,i)=>{
                index++;
                return {
                    myY: parseInt(obj.total_duration ?? "1")/1e9,
                    myX: index.toString()
                }
            }
        )
    })  

    $effect(()=>{
        console.log(mediaTempoGeral)
    })
    $effect(()=>{
        if(signal.state.signal==="openStatistics"){
            const id = parseInt(page.url.pathname.split("/")[2])
            chatEstatisticas = data.chats.find((obj)=>obj.id===id);
            console.log(chatEstatisticas)
            isVisible=true
            signal.reset()
        }
    })

</script>


<PopUp bind:isVisible>

    <div class="flex flex-col items-center justify-center bg-white rounded-2xl w-[450px] relative p-8 ">
      
        <div class="flex justify-center w-full">
            <h2 class="text-[42px] text-left">Statistics</h2>
        </div>

        {#if mediaTempoGeral.length>0}
        <div class="grid gap-4 grid-cols-2 grid-rows-7 w-full p-4 relative h-full">

            <div class="flex gap-4 col-span-2  row-span-2 p-2 px-4 border shadow-md rounded-lg">
                <div class="flex flex-col">
                    <h3 class="text-[20px]">Avarage response time:</h3>
                    <NumberCount extraString="s" number={mediaTempoGeral.reduce((acc, curr) => acc + curr.myY, 0)/mediaTempoGeral.length} className="text-[48px]"/>
                    </div>
                   <AreaGraph data={mediaTempoGeral}/>
            </div>
            
            <!-- <div class="flex gap-4 col-span-2  row-span-2 p-2 px-4 border shadow-md rounded-lg">
                <div class="flex flex-col">
                    <h3 class="text-[20px]">Models comparation:</h3>
                    <NumberCount extraString="s" number={mediaTempoGeral.reduce((acc, curr) => acc + curr.myY, 0)/mediaTempoGeral.length} className="text-[48px]"/>
                </div>
                {#if mediaTempoGeral.length>0}
                   <MultiGraph/>
                {/if}
            </div> -->
        </div>
        {:else}
        <h3>Not able to process anything for now</h3>
        {/if}

    </div>

</PopUp>