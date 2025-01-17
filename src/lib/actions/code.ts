import { mount, onMount } from "svelte";
import Code from "../../components/sections/Code.svelte";




export function codeMarkdown(node:Element){

    
    onMount(()=>{
        const childs = Array.from(node.children);
        childs.forEach((child, i) => {
            if (child.tagName === "PRE") {
                parseCoder(child, i);
            }
        });
    })

    const parseCoder = (element:Element,i:number) =>{
        
        const childs = Array.from(element.children)
        childs.forEach((child, i) => {
            if (child.tagName === "CODE") {
                const code  = mount(Code,{
                    target: element,
                    props:{
                        code: child.innerHTML
                    }
                })
                element.removeChild(child)
            }
        });
        
        
    }


}