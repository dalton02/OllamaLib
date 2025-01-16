<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import type { Chat } from "$lib";
	import data from "$lib/data.svelte";
	import handleDate from "$lib/sanitizers/time";
	import signal from "$lib/signal.svelte";
	import { nextDay } from "date-fns";
	import NumberCount from "../anim/NumberCount.svelte";
	import PopUp from "../modal/PopUp.svelte";
	import AreaGraph from "./graphs/AreaGraph/AreaGraph.svelte";
	import Bar from "./graphs/BarGraph/Bar.svelte";

    let isVisible = $state<boolean>(false)

    let chatEstatisticas = $derived.by<Chat | undefined>(()=>{
        const id = parseInt(page.url.pathname.split("/")[2])
        const tmp = data.chats.find((obj)=>obj.id===id)
        return tmp
    })
    
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
    
    let paginaMedia = $state<number>(1)
    
    function next(){
        if(paginaMedia>=Math.ceil((mediaTempoGeral.length)/9)){
            return;
        }
        paginaMedia++
    }
    function prev(){
        if(paginaMedia<=1){
            return;
        }
        paginaMedia--
    }

    function mediaByModel(model:string){
        if(!chatEstatisticas) return
        const chat = chatEstatisticas.mensagens.filter(obj=> obj.modelo===model && obj.eval_duration);
        const total = chat.reduce((pv,cr)=>{ 
            if(cr.total_duration){
                pv+=parseInt(cr.total_duration)
            }
            return pv
        },0)
        return {
            model:model,
            value: total/chat.length/1e9
        }
    }

    function findAllMedias():any[]{
        let all:{model:string,value:number}[] = []
        if(!chatEstatisticas) return []
        for(const c of chatEstatisticas.mensagens){
            if(all.find((obj)=>obj.model===c.modelo)) continue
            const tmp = mediaByModel(c.modelo)
            if(!tmp) continue
            all.push(tmp)
        }
        return all
    }

    $effect(()=>{
        if(signal.state.signal==="openStatistics"){
            isVisible=true
            signal.reset()
        }
    })

</script>


<PopUp bind:isVisible>

    <div class="flex flex-col items-center justify-center bg-white rounded-2xl w-[850px] relative p-8 ">
      
        <div class="flex justify-center w-full">
            <h2 class="text-[42px] text-left">Statistics</h2>
        </div>

        {#if mediaTempoGeral.length>0}
        <div class="flex flex-col gap-4 w-full p-4 relative h-full">

            <div class="flex gap-4 col-span-2  row-span-2 p-3 px-4 border shadow-md rounded-lg">
                <div class="flex flex-col">
                    <h3 class="text-[20px]">Avarage response time:</h3>
                    <NumberCount extraString="s" number={mediaTempoGeral.reduce((acc, curr) => acc + curr.myY, 0)/mediaTempoGeral.length} className="text-[48px]"/>
                    </div>
                    <div class="flex mx-2 relative items-center w-[75%]">
                        {@render arrow(()=>prev(),"Prev page","rotate-[180deg]","left-[-22px]")}
                       <AreaGraph data={mediaTempoGeral.slice(9*(paginaMedia-1),9*(paginaMedia))}/>
                       {@render arrow(()=>next(),"Next page","","right-[-22px]")}
                    </div>

                </div>
            
            {#if findAllMedias().length>1}
                <div class="flex flex-col gap-4 col-span-2  row-span-2 p-3 px-4 border shadow-md rounded-lg">
                    <h3 class="text-[20px]">Models comparation (seconds):</h3>
                    <Bar data={findAllMedias()}/>,
                </div>
            {/if}
        </div>

        {:else}
            <h3>Not able to process anything for now</h3>
        {/if}

    </div>

</PopUp>


{#snippet arrow(onClick:Function,label:string,classSvg:string,classBtn:string)}
    <button onclick={()=>onClick()}  class="p-1 absolute {classBtn}" aria-label={label}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" class={classSvg} fill="#000000" viewBox="0 0 256 256"><path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path></svg>
    </button>
{/snippet}