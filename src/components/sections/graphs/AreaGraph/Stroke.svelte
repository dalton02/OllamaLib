<!--
  @component
  Generates an SVG line shape.
 -->
 <script lang="ts">
	import { slidefade } from '$lib/anim';
    import { getContext } from 'svelte';
	import { cubicOut, expoInOut, quadInOut } from 'svelte/easing';
	import { draw, scale, type TransitionConfig } from 'svelte/transition';
  
    const { data, xGet, yGet }:{data:any,xGet:any,yGet:any} = getContext('LayerCake');
  
    /** @type {String} [stroke='#ab00d6'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
    export let stroke = '#ab00d6';
  
    $: path =
      'M' +
      $data
        .map((d:any) => {
          return $xGet(d) + ',' + $yGet(d);
        })
        .join('L');


    

  </script>
  {#key path}
  <path class="path-line" transition:slidefade|global  stroke-linejoin="round" stroke-linecap="round" d={path} {stroke}></path>
  {/key}
  <style>
    .path-line {
      fill: none;
      stroke-width: 2;
    }
  </style>