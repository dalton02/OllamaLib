<script lang="ts">
    import type { Snippet } from "svelte";
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";
    import { fade, fly, scale, slide, type TransitionConfig } from "svelte/transition";
    
    type Props = {
        isDrop:boolean,
        className:string,
        children:Snippet,
    }

    let {isDrop,className,children}:Props= $props()
    
    

</script>


{#if isDrop}
    <div class="{className}" transition:slide>
        {@render children?.()}
    </div>
{/if}