<script lang="ts">
  import type { Snippet } from "svelte";


    let {title,children,className,classPosTitle="top-[-90%] left-[50%]",padrao=0}:{title:string,children:Snippet,className:string,classPosTitle?:string,padrao?:number} = $props()

</script>



<div class="relative pointer-events-auto group {className}">
    
  {#if padrao===0}
    <span class="text-[14px] {classPosTitle} whitespace-nowrap group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
      translate-y-[30%] delay-150 text-zinc-50 opacity-0 scale-50 duration-300 font-medium ease-in-out absolute pointer-events-none z-10 bg-slate-800 p-1 px-2 rounded-lg">
          {title}
    </span>
  {:else}    
      <span class="text-[14px] {classPosTitle} group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
      translate-y-[30%] delay-150 text-neutral-900 opacity-0 scale-50 duration-300 font-medium ease-in-out absolute pointer-events-none z-10 bg-white border shadow-lg p-1 px-2 rounded-lg">
      {title}
    </span>
  {/if}

    {@render children?.()}

</div>