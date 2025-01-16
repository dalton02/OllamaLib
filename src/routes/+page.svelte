<script lang="ts">
	import signal from "$lib/signal.svelte";
	import { onMount } from "svelte";
	import LetterSpawn from "../components/anim/LetterSpawn.svelte";
	import Typer from "../components/anim/Typer.svelte";
	import { scale } from "svelte/transition";
	import { quadIn, quadInOut, quadOut, sineInOut } from "svelte/easing";

    const easing="[transition-timing-function:cubic-bezier(0.37,0,0.63,1)]"

    let mounted = $state<boolean>(false)
        
    onMount(()=>{
        mounted=true
    })

</script>


<div class="flex flex-col items-start justify-start rounded-2xl relative">

    <LetterSpawn label="Hello There" color="text-[#181818] leading-6" initDelay={200}/>
    <LetterSpawn label="Want to use the full power of AI?" color="text-[#0F0F0F]" size="text-[60px]" initDelay={1000}/>
    <div class="flex w-full items-start justify-start">
       <Typer delay={2600} label="Start chating with your ollama :)" infinite={false} size="text-[26px]" color="text-[#3F3F3F]"/>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" width="70" class="absolute top-[30px] left-[-110px] hidden fill-green-700 wave-hand" viewBox="0 0 256 256">
        <path d="M219.31,98.46A88,88,0,1,1,67.08,186.77h0L26.15,115.88a16,16,0,0,1,27.69-16L72.4,132a8,8,0,0,0,13.86-8L47,56A16,16,0,0,1,74.69,40L114,108a8,8,0,1,0,13.85-8l-30-52a16,16,0,0,1,27.71-16L166,102.12A48.25,48.25,0,0,0,152,136a47.59,47.59,0,0,0,9.6,28.8,8,8,0,1,0,12.79-9.61A32,32,0,0,1,181,110.26a8,8,0,0,0,2.17-10.43L171.71,80a16,16,0,0,1,27.71-16l19.89,34.46Zm-29.37-57A43.74,43.74,0,0,1,216.74,62l.33.57a8,8,0,0,0,13.86-8L230.6,54a59.64,59.64,0,0,0-36.54-28,8,8,0,0,0-4.12,15.46ZM79.58,225.72A103.58,103.58,0,0,1,53.93,196a8,8,0,0,0-13.86,8,119.56,119.56,0,0,0,29.6,34.28,8,8,0,0,0,9.91-12.56Z">
        </path>
    </svg>

    {#if mounted}
        <button in:scale={{delay:2300,duration:1500,easing:sineInOut}}
        onclick={()=>signal.send("openNovaConversa")} class="group mb-4  rounded-lg bg-white border border-gray-200 shadow-xl relative group 
            flex gap-2  items-center font-semibold  text-[22px] duration-700 mt-6 px-7 p-2 hover:bg-neutral-950 {easing}">
            <b class="font-medium group-hover:translate-x-6 duration-500 group-hover:text-white {easing}">Create Chat</b>
            <div class="relative overflow-hidden bg-black group-hover:bg-white rounded-md p-1 duration-500 {easing} group-hover:translate-x-[-105px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" class="group-hover:rotate-180 group-hover:fill-black delay-300 duration-500 {easing}" fill="white" viewBox="0 0 256 256">
                    <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
                </svg>
            </div>
        </button>
    {/if}


</div>