<script lang="ts">
    
    import { browser } from "$app/environment";
    import type { Snippet } from "svelte";
    
    type Props = {
        viewObject:boolean,
        containersWithinFocus:HTMLElement[],
        className:string,
        children:Snippet
    }

    let {viewObject = $bindable(),containersWithinFocus=[],className,children}:Props= $props()

    let container = $state<HTMLDivElement>();


    $effect(()=>{
        if(container && viewObject===true){
             container.focus();
        }
    })


    $effect(()=>{
        if(container && containersWithinFocus.length>0 && browser){
            for(let i in containersWithinFocus){
                containersWithinFocus[i].addEventListener("blur",(event)=>lostFocus(event));
            }
        }
    })
    
    function lostFocus(event:any){        
        if(!container) return
        const elemento = event.relatedTarget;
        if(containersWithinFocus.some((obj)=> obj===elemento)){
            return
        }
        if(!container.contains(elemento)){
            viewObject=false;
        }
        else{
            container.focus();
        }
    }


</script>


<div class={className} bind:this={container} onblur={lostFocus} tabindex="-1">
   {@render children?.()}
</div>