<script lang="ts">
	import { onMount } from "svelte";
	import { bounceIn, bounceInOut, bounceOut, elasticInOut, elasticOut, quadInOut } from "svelte/easing";
	import type { HTMLAttributes } from "svelte/elements";
	import { scale } from "svelte/transition";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        label: string;
        initDelay?: number;
        color?:string;
        size?:string;
    }



    let {label,initDelay=0,color="text-neutral-700",size="text-[40px]"}:Props = $props()


    

    const easing="[transition-timing-function:cubic-bezier(0.37,0,0.63,1)]"


    let mounted = $state<boolean>(false)
    
    onMount(()=>{
        mounted=true
    })

</script>





<div class="flex ">
    {#if mounted}
    {#each label as letter,i}
        <div class="{easing} {color} {size} {letter===" " && "ml-[4px]"}" in:scale|global={{duration:900,delay:i*30+initDelay,easing:quadInOut}}>
            {letter}
        </div>
    {/each}
    {/if}
</div>


