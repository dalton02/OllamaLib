<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
  
    import Line from './Stroke.svelte'
    import Area from './Area.svelte';
    import AxisX from './AxisX.svelte';
    import AxisY from './AxisY.svelte';
  
    const xKey = 'myX';
    const yKey = 'myY';
    let {data}:{data:{myX:string,myY:number}[]} = $props()
  </script>
  
  <div class="flex-grow overflow-hidden h-[200px]">
    <LayerCake
      padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
      x={xKey}
      y={yKey}
      height={200}
      yDomain={[0, null]}
      data={data}
    >
      <Svg>
        <AxisX  />
        <AxisY ticks={4} />
        <Line stroke="#D33632"/>
        <Area  />
      </Svg>
    </LayerCake>
  </div>
