


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

    <div class="flex flex-col items-center justify-center w-[900px]  bg-slate-50 rounded-2xl p-7">
      
        <div class="flex justify-between w-full">
            <h2 class="text-[28px] text-left">Statistics</h2>
            <button onclick={()=>isVisible=false} aria-label="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
            </button>
        </div>

        <div class="grid gap-4 grid-cols-2 grid-rows-7 w-full p-4 relative h-full">

            <div class="flex gap-4 col-span-2  row-span-2 p-2 px-4 border shadow-md rounded-lg">
                <div class="flex flex-col">
                    <h3 class="text-[20px]">Avarage response time:</h3>
                    <NumberCount extraString="s" number={mediaTempoGeral.reduce((acc, curr) => acc + curr.myY, 0)/mediaTempoGeral.length} className="text-[48px]"/>
                </div>
                {#if mediaTempoGeral.length>0}
                   <AreaGraph data={mediaTempoGeral}/>
                {/if}
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

    </div>

</PopUp>