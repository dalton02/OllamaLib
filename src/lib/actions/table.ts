



export function tableDiv(node:Element){

    const childs = Array.from(node.children); 

    childs.forEach((child, i) => {
        if(child.tagName==="TABLE"){

            const div = document.createElement("div");
            div.style.flexShrink="0";
            div.style.overflowX="auto";

            div.appendChild(child);
            node.insertBefore(div, node.children[i]);

        }

    })


}