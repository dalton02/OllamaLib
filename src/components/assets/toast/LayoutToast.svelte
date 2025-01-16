
<script lang="ts">
    import { fly } from "svelte/transition";
    import { expoIn, expoOut } from "svelte/easing";
	import toast from "$lib/toast.svelte";
	import { flySlide } from "$lib/anim";
  
  </script>
  
  
  <div class="fixed pointer-events-none z-50 top-0 left-0 w-screen h-screen p-12 flex flex-col items-center gap-4">
      {#each toast.toast as t,i (t.id)}
          <div class="flex flex-row items-center gap-1 text-body-large font-semibold text-[#555] p-4 py-2 
          rounded-md shadow-lg border border-[rgba(0,0,0,.05)] bg-[#ffffff]"
          in:flySlide={{ y: 80, duration: 1000,axis:"y",easing:expoOut }}
          out:flySlide={{ y: -200, duration:1000,axis:"y",easing:expoIn }}>
  
            {@html t.conteudo}
          
          </div> 
       {/each}
  </div>
  