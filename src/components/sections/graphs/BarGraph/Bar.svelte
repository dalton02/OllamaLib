<script lang="ts">
    import { LayerCake, Svg, Html } from 'layercake';
    import { scaleBand } from 'd3-scale';
  
    import Column from './Column.svelte';
    import AxisX from './AxisX.svelte';
    import AxisY from './AxisY.svelte';

    const xKey = 'model';
    const yKey = 'value';

    let {data}:{data:{model:string,value:number}[]} = $props()

    
</script>
  
  <div class="chart-container">
    <LayerCake
      padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
      x={xKey}
      y={yKey}
      xScale={scaleBand().paddingInner(0.02).round(true)}
      xDomain={data.map((obj)=>obj.model)}
      yDomain={[0, null]}
      {data}
    >
      <Svg>
        <AxisX gridlines={false} />
        <AxisY snapBaselineLabel />
        <Column />
      </Svg>
  
    </LayerCake>
  </div>
  
  <style>
    /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
    .chart-container {
      width: 100%;
      height: 250px;
    }
  </style>