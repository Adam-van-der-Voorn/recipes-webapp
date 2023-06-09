import { string } from "yup";
import ingredientKeywords from "./ingredientKeywords";
import units from "./units";
import verbs from "./verbs";



const TEXT_NODE_TYPE = 3;
const CANDIDATE_ID_ATTR = 'data-avdvoorn-ingredient-candidate-id';


const ingredientsRegex = new RegExp(`\\b(?<ingredients>${ingredientKeywords.join("|")})\\b`, "gmi");
const verbsRegex = new RegExp(`\\b(?<verbs>${verbs.join("|")})\\b`, "gmi");


export function collectKeywords(page: string) {
    const html = document.createElement("html");
    html.innerHTML = page;
    const bodies = html.querySelectorAll('body');
    console.assert(bodies.length === 1, "collectKeywords: There should only be one body");
    const body = bodies[0];
    const unwanted = Array.from(body.querySelectorAll("script,style,link,svg,img,source,picture"));
    for (const el of unwanted) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
        else {
            console.error("collectKeywords: could not remove el", el);
        }
    }
    const candidates = new Map<Node, number>();
    getCandidates(body).forEach(c => {
        candidates.set(c, 0)
    })
    
    // once candidates have been gotten
    // we use the heuristics to filter them them out
    // conatins no verbs
    const candidates2 = new Map<Node, number>();
    candidates.forEach((v, k) => {
        let newV = v;
        if (text(k).match(verbsRegex) === null) {
            newV += 1;
            candidates2.set(k, newV)
        }
    })

    const commonParent = getCommonParents(Array.from(candidates2).map(x => x[0]))
    console.log("COMMON PARENT", commonParent)
    // console.log("COMMON PARENT INNER", innerTextFancy(commonParent))



    // common parent multiplier
    // collect parents
    // const parents: Map<Node, number> = new Map();
    // candidates2.forEach((v, k) => {
    //     if (!k.parentElement) {
    //         console.warn("no parent");
    //         return;
    //     }
    //     const parent = k.parentElement;
    //     let parentId = parent.getAttribute(PARENT_ID_ATTR);
    //     if (!parentId) {
    //         parentId = id();
    //         parent.setAttribute(PARENT_ID_ATTR, parentId)
    //     }
    //     let prevCount = parents.get(parent) ?? 0;
    //     parents.set(parent, prevCount + 1)
    // })
    // Array.from(parents).forEach(p => console.log("PARENT {", p[1], "):", innerTextFancy(p[0])));
    // Array.from(parents).forEach(p => {
    //     const lines = innerTextFancy(p[0])
    //         .split('\n')
    //         .filter(str => str.trim().length > 0)
    //     console.log("LINES", lines)
    //     lines.forEach(line => console.log("split", splitIngredientLine(line)))
    // });
    // get the most common parent
    // const mostCommonParent = Array.from(parents)
    //     .reduce((current, next) => {
    //         if (next[1] > current[1]) {
    //             return next;
    //         }
    //         return current;
    //     })
    // const candidates3 = new Map();
    // candidates2.forEach((v, k) => {
    //     const parentId = k.parentElement!.getAttribute(PARENT_ID_ATTR)!;
    //     let newV = v;
    //     if (parentId === mostCommonParent[0]) {
    //         newV += 1;
    //     }
    //     candidates3.set(k, newV);
    // })

    // short (5 -15 chars)
    // const candidates3 = new Map();
    // candidates.forEach((v, k) => {
    //     let newV = v;
    //     const len = text(k).length;
    //     const limit = 25
    //     if (len > limit) {
    //         newV -= Math.floor((len - limit) / 10);
    //     }
    //     candidates3.set(k, newV)
    // })


    const sorted = Array.from(candidates2)
    sorted.sort(([_k0, v0], [_k1, v1]) => v0 - v1)
    
    console.log("ranked candidates", sorted.map(([k, v]) => `${v}: ${display(k)}`));

    // may contain number / unit pairs, or just numbers. These are likey at the start and end, and nnot in the middle (grams)
    // idea- include the candidtes parents, and perhaps even thier parents parent as candidates.
    //// they can be weighted against the same heuistic as the others.
}

function getCandidates(root: Element): Set<Node> {
    const htmlElems = Array.from(root.querySelectorAll("*"));

    let candidates: Set<Node> = new Set();
    for (const el of htmlElems) {
        // we check children bc textnode is not included in * selector
        for (const child of Array.from(el.childNodes)) {
            if (child.nodeType === TEXT_NODE_TYPE && child.nodeValue && child.nodeValue.match(ingredientsRegex) !== null) {
                // if (el.childNodes.length !== 1) {
                    // case where br seperated textnodes
                    candidates.add(child)
                    // console.log("added ", display(child))
                // }
                // if (el.getAttribute(CANDIDATE_ID_ATTR)) {
                //     // console.log("including el", display(el))
                //     candidates.add(el)
                //     el.setAttribute(CANDIDATE_ID_ATTR, id())
                // }
                // if (el.parentElement!.getAttribute(CANDIDATE_ID_ATTR)) {
                //     // console.log("including els parent", display(el.parentElement))
                //     candidates.add(el.parentElement!)
                //     el.parentElement!.setAttribute(CANDIDATE_ID_ATTR, id())
                // }
            }
        }
    }
    return candidates;
}

function text(node: Node): string {
    if (node.nodeType === TEXT_NODE_TYPE) {
        return node.nodeValue ?? "";
    }
    else {
        // assume htmlelem
        return (node as HTMLElement).innerText ?? "";
    }
}

function display(node: Node, maxLen?: number): string {
    let val
    if (node.nodeType === TEXT_NODE_TYPE) {
        val = node.nodeValue ?? "<empty text>";
    }
    else {
        // assume htmlelem
        val = (node as HTMLElement).innerText ?? "<no innerhtml>";
    }
    
    if (maxLen) {
        val = val.slice(0, maxLen)
    }

    return val;
}

function displayHTML(node: Node, maxLen?: number): string {
    let val
    if (node.nodeType === TEXT_NODE_TYPE) {
        val = node.nodeValue ?? "<empty text>";
    }
    else {
        // assume htmlelem
        val = (node as HTMLElement).innerHTML ?? "<no innerhtml>";
    }
    
    if (maxLen) {
        val = val.slice(0, maxLen)
    }

    return val;
}

/** tries to parse newlines */
function innerTextFancy(node: Node) {
    if (node.nodeType === TEXT_NODE_TYPE) {
        return node.nodeValue ?? "";
    }
    // assume HTMLElem
    let innerText = "";
    const el = node as HTMLElement;
    for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === TEXT_NODE_TYPE && child.nodeValue) {
            innerText += child.nodeValue;
            continue;
        }
        const childEl = child as HTMLElement;
        const tag = childEl.tagName;
        if (tag === "br" || tag === "hr") {
            innerText += "\n";
            continue;
        }
        if (!isInline(childEl)) {
            innerText += "\n"
        }
        innerText += innerTextFancy(childEl);
    }
    return innerText;
}

function isInline(el: HTMLElement) {
    const display = el.style.display ?? window.getComputedStyle(el).display; 
    if (display === "inline" || display === "inline-block" || display === "inline-grid" || display === "inline-flexbox") {
        return true;
    }
    return false;
}

const fractions = ['½', '¼', '¾', '⅐', '⅑', '⅒', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞'].join("|");

const num = `${fractions}|((\\d+)([\\./]\\d+)?)`;
const unit = `\\b(${units.join("|")})\\b`;
const unitRegex = new RegExp(unit, "gmi")
const unitValRegex = new RegExp(`(${num}) ?(${unit})?`, "gmi");
export function splitIngredientLine(line: string) {
    const it = line.matchAll(unitValRegex);
    let quantity = null;
    let res = it.next()
    while (!res.done) {
        const match = res.value?.[0]?.trim();
        if (!quantity) {
            quantity = match;
        }
        if (unitRegex.test(match)) {
            quantity = match;
            break;
        }
        res = it.next()
    }
    const ingredient = quantity
        ? line
            .split(quantity)
            .reduce((base, next) => base.trimRight() + " " + next.trimLeft(), "")
            .trim()
        : line;
    console.log("for " + line)
    console.log("matchRes", it)
    console.log("quantity", quantity)
    console.log("ingredient", ingredient)
    unitValRegex.lastIndex = 0;
    return { quantity, ingredient }
}


function getCommonParents(nodes: Node[]) {
    const numNodes = nodes.length;

    // should be the mapping:
    // node -> number of children that are candidates
    let nodeChildCounts = new Map<Node, number>();
    nodes.forEach(node =>
        nodeChildCounts.set(node, 1)
    )
    console.log("NODE MAP", nodeChildCounts)
    // console.log("NODE MAP", Array.from(nodesMap.entries()).map((entry) => `${display(entry[0])}`))
    
    for (const node of nodes) {
            nodeChildCounts = incrementAllParents(node, nodeChildCounts);
            console.log("NODE MAP", nodeChildCounts)
            // console.log("NODE MAP", Array.from(nodesMap.entries()).map((entry) => `${display(entry[0])}`))
            for (const [node, numChildren] of nodeChildCounts.entries()) {
                if (numChildren >= numNodes) {
                    console.assert(numChildren === numNodes, "this should never happen, and indicates buggy code")
                    const x = Array.from(nodeChildCounts)
                        .map(([node, count]) => ({ node, count }))
                    x.sort((a, b) => a.count - b.count)
                    return x;
                }
            }
    }
    throw new Error("We messed up :(")

    // for each node
    // ge tthe parent, add to map as 1
    // for ecah parent, get he parent. If parent does not exits set to the num child nodes.
    //// else set to parent val + num child nodes

}

function incrementAllParents(node: Node, nodes: Map<Node, number>): Map<Node, number> {
    const newNodes = new Map(nodes)
    let currentNode = node;
    while (true) {
        const parent = currentNode.parentElement;
        console.log("parent", parent)
        if (parent === null) {
            return newNodes;
        }
        const parentRef = getAsCached(parent);
        const oldVal = newNodes.get(parentRef) ?? 0;
        newNodes.set(parentRef, oldVal + 1)
        currentNode = parentRef;
        // if (parentId === "11") {
        //     console.log("node", node, "added it's childcount of", childCount, "to", oldVal)
        // }
    }
}

// cacheing

const ID_ATTR = 'data-avdvoorn-id';

let idPool = 0;
const nextID = () => {
    idPool += 1;
    return idPool.toString(10);
}

const elementCache: Record<string, Element> = {}

/** ensures that you get the same refrence to the element, so it can be used for sets/comparisons etc... */
const getAsCached = (el: Element): Element => {
    let id = el.getAttribute(ID_ATTR);
    if (!id) {
        id = nextID();
        elementCache[id] = el;
        el.setAttribute(ID_ATTR, id)
    }
    const ref = elementCache[id]
    console.assert(ref !== undefined, "cache not properly populated")
    return ref;
}