import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function slidefade(node:any):TransitionConfig {
    const existingTransform = getComputedStyle(node).transform.replace('none', '');

    return {
        delay: 500,
        duration: 1000,
        easing: cubicOut,
        css: (t, u) => `transform-origin: bottom left; transform: ${existingTransform} scaleY(${t}); opacity: ${t};`
    };
}