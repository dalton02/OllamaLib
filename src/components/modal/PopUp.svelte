<script lang="ts">
    import type { Snippet } from "svelte";
    import { quadIn, quadOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    type Props={
        isVisible:boolean,
        children:Snippet
    }
    let {isVisible = $bindable(),children}:Props = $props();

</script>


{#if isVisible}

    <div class="fixed w-screen h-screen bottom-0 left-0 bg-[rgba(0,0,0,.4)] backdrop-blur-[1px] flex justify-center items-center z-40"
    in:fade
    out:fade
    
    >

        <div class="flex flex-col justify-start items-start z-20"   
        in:fly={{y:2000,opacity:1,duration:500,easing:quadOut}}
        out:fly={{y:2000,opacity:1,duration:500,easing:quadIn}}>
            {@render children?.()}
        </div>
        <button class="absolute top-0 left-0 w-screen h-svh z-10 cursor-default" onclick={()=>isVisible=false}>
            .
        </button>
    </div>


{/if}