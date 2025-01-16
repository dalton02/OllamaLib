<script lang="ts">
	import toast from "$lib/toast.svelte";
	import { Highlight, HighlightAuto } from "svelte-highlight";

    import styleCode from "svelte-highlight/styles/github-dark";
    export let code:string;

    function copyText(){
        navigator.clipboard.writeText(code)
        toast.sucess("Code in clipboard")
    }

</script>


<svelte:head>
  {@html styleCode}
</svelte:head>
<div class="flex  text-[14px] bg-lightStrong  my-5 bg-[#0D1117]  w-full rounded-lg relative pt-4 px-1 flex-col">

    <div class="flex flex-row w-full justify-end px-4 pt-2 absolute right-0 top-0">
        <button class="flex group gap-2 py-2" onclick={()=>{copyText()}}>
            <span class="text-white group-hover:text-slate-500 duration-300 text-[12px] ease-in-out">Copy</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"  class={"fill-white"} viewBox="0 0 256 256">
                <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z">
                </path>
            </svg>
        </button>
        
    </div>
    
    <HighlightAuto  class="text-[14px] rounded-lg font-code overflow-x-auto scroll-padrao w-full" code={code}/>

</div>

<style>

*{
  font-family: "Space Mono", serif;
  font-weight: 100;
  font-style: normal;
}
</style>