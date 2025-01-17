<script lang="ts">
	import { onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        label: string;
        infinite?: boolean;
        frames?: number;
        delay?:number;
        color?:string;
        size?:string;
    }



    let {label,infinite=true,frames=80,color="text-neutral-700",size="text-[14px]",delay=0}:Props = $props()


    let step = $state<number>(0)
    let fade = $state<boolean>(false)
    let realWidth = $state<number>(0)

    let container = $state<HTMLDivElement>()

    function anim(){
        const id = setInterval(()=>{

            if(step===label.length){
                if(!infinite){
                    clearInterval(id)
                    return;
                }
                clearInterval(id)
                setTimeout(reset,frames*6)
                return;
            }
            step+=1;
        },frames)
    }

    function reset(){
        step=0
        anim();
    }

    onMount(() => {
        if(container){
            realWidth = container.getBoundingClientRect().width;
            fade=true;
            setTimeout(()=>{
                anim()
            },delay)
        }
    });

</script>




<div class="border-r fade {!fade && "opacity-0"} overflow-hidden whitespace-nowrap {color} {size}" bind:this={container} 
style="width:{fade ? ((realWidth*step)/label.length)+"px" : "auto"};">
    {label}
</div>


<style>
    .fade{
        animation: fade 0.5s infinite;
    }
    @keyframes fade{
        0%{
            border-color: initial;
        }
        100%{
            border-color: transparent;
        }
    }
</style>