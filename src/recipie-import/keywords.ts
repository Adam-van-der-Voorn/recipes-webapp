import ingredientKeywords from "./ingredientKeywords";

const TEXT_NODE_TYPE = 3;

const regex = new RegExp(`(?<ingredients>${ingredientKeywords.join("|")})`, "gm");

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
    const candidates = getCandidates(body);
    console.log("candidates", candidates.map(c => `${c.innerText ?? "-"} | ${c.tagName} | c:${c.getAttribute("class") ?? "-"} | id:${c.getAttribute("id") ?? "-"}`));
}

function isCandidate(el: HTMLElement) {
    // candidates are elements with children that are either all:
    /// textnodes
    /// inline elemtns with children that are all candidates
    // essentaily if an elemnt has children that are fully inline, it is a 
    // candidate for an ingredient
    if (el.tagName === "A") {
        return false;
    }
    if (el.innerText === undefined || el.innerText === "") {
        return false;
    }
    for (const child of Array.from(el.children)) {
        if (child.nodeType !== TEXT_NODE_TYPE) {
            if (!(child instanceof HTMLElement)) {
                return false;
            }
            if (!isInline(child)) {
                return false;
            }
            else if (!isCandidate(child)) {
                return false;
            }
        }
    }
    return true;
}

function getCandidates(el: HTMLElement): HTMLElement[] {
    // check if candidate for ingredient
    if (isCandidate(el)) {
        return [el]
    }

    let candidates: HTMLElement[] = [];
    for (const child of Array.from(el.children)) {
        if (child instanceof HTMLElement) {
            candidates = [...candidates, ...getCandidates(child)];
        }
        else {
            console.warn("collectKeywords: skipped element", child, "as it was not an HTMLElement");
        }
    }
    return candidates;
}

function isInline(el: HTMLElement): boolean {
    const display = el.style.display ?? window.getComputedStyle(el).display;
    return display.includes("inline");
}