<!--
  @component
  Generates an SVG area shape.
 -->
 <script lang="ts">
	import { slidefade } from '$lib/anim';
    import { getContext } from 'svelte';
  
    const { data, xGet, yGet , xScale, yScale, extents }:{data:any,xGet:any,yGet:any, xScale:any, yScale:any, extents:any } = getContext('LayerCake');
  
    /**  @type {String} [fill='#ab00d610'] The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
    export let fill = '#ab00d610';
  
    $: path =
      'M' +
      $data
        .map((d:any) => {
          return $xGet(d) + ',' + $yGet(d);
        })
        .join('L');
  
    /**  @type {String} **/
    let area:any;
  
    $: {
      const yRange = $yScale.range();
      area =
        path +
        ('L' +
          $xScale($extents.x ? $extents.x[1] : 0) +
          ',' +
          yRange[0] +
          'L' +
          $xScale($extents.x ? $extents.x[0] : 0) +
          ',' +
          yRange[0] +
          'Z');
    }
  </script>

  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <!-- Cor sólida no topo -->
      <stop offset="40%" stop-color="#D33632" stop-opacity="0.2" />
      <!-- Transparente no fundo -->
      <stop offset="90%" stop-color="#D33632" stop-opacity="0" />
    </linearGradient>
  </defs>
  {#key area}
  <path class="path-area" transition:slidefade|global d={area} fill="url(#grad)"></path>
  {/key}