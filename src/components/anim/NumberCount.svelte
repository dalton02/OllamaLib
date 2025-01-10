<script lang="ts">

    let {number,className,extraString} = $props()

    let random = $state<number>(Math.random()*100)

    const id = setInterval(()=>{
        random = Math.random()*(number*2)
    },10)

    setTimeout(()=>{
        clearInterval(id)
        random = number
    },1200)

</script>


<span class={className}>{random.toFixed(2)}{extraString}</span>