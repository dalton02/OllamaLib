<script lang="ts">

    let {width,className,color="white transparent"}:{width:number,className:string,color?:string} = $props()

</script>
<div class="w-full h-full justify-center items-center {className}">
    <div class="loader" style="width:{width}px;border-color:{color}"></div> 
</div>

<style>
.loader {
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid;
  animation: l1 1s infinite;
}
@keyframes l1 {to{transform: rotate(.5turn)}}
</style>
