<script>
    import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
  
    import { scaleOrdinal } from 'd3-scale';
    import { timeParse, timeFormat } from 'd3-time-format';
    import { format } from 'd3-format'; 
  
    import MultiLine from './MultiLine.svelte';
    import AxisX from './AxisX.svelte';
    import AxisY from './AxisY.svelte';
    import Labels from './GroupLabels.html.svelte';
    import SharedTooltip from './SharedTooltip.html.svelte';
  
    /* --------------------------------------------
     * Set what is our x key to separate it from the other series
     */
    const xKey = 'month';
    const yKey = 'value';
    const zKey = 'fruit';
  
    const data = [
      {
        fruit:"oranges",
        values:[  
          {
                "value": 3840,
                "month": 1,
                "fruit": "apples"
            },
            {
                "value": 1600,
                "month": 2,
                "fruit": "apples"
            },
        ]
      }
    ]
  
    const seriesNames = Object.keys(data[0]).filter(d => d !== xKey);
    const seriesColors = ['#ffe4b8', '#ffb3c0', '#ff7ac7', '#ff00cc'];
  
    /* --------------------------------------------
     * Cast values
     */
    const formatLabelX = timeFormat('%b. %e');
    const formatLabelY = d => format(`~s`)(d);
  
    const groupedData = groupLonger(data, seriesNames, {
      groupTo: zKey,
      valueTo: yKey
    });
  </script>
  
  <div class="chart-container w-[400px]] h-[200px]">
    <LayerCake
    padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
    x={xKey}
    y={yKey}
    z={zKey}
    yDomain={[0, null]}
    height={200}
    zScale={scaleOrdinal()}
    zRange={seriesColors}
    flatData={flatten(groupedData, 'values')}
    data={groupedData}
  >
    <Svg>
      <AxisX
        gridlines={false}
        format={formatLabelX}
        snapLabels
        tickMarks
      />
      <AxisY ticks={4} format={formatLabelY} />
      <MultiLine />
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