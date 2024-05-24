import { on } from "events";
import puppeteer from "puppeteer";
import { writeFileSync, readFileSync} from "fs";
import {extract} from "./extractor.js";

const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36`;




const walkExtracted = (root: {}) => {

    console.log("Walking...");
    console.log(root);
    for(const child in root.children) {

        if (root.type === 'block' && root.fontSize && parseInt(root.fontSize) > 16) {
            console.log("Found title");

            if(child.type === "text") {
                console.log(`${child.text} => ${root.fontSize}`);
            }
        }

        walkExtracted(child);

    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent(USER_AGENT);
    await page.goto('https://www.databricks.com/company/careers/engineering/senior-software-engineer---backend-6779084002');
    //await page.setContent(readFileSync('databricks.html').toString());

    const html = await page.content();
    const extracted = await page.evaluate(extract);
    //writeFileSync('databricks.html', html);
    console.log(extracted);
    //walkExtracted(extracted);

    await browser.close();
})();





/*
* createTreeWalker
* root: A node representing the root
* whatToShow: nodeFilter.SHOW_ALL or NodeFilter.SHOWTEXT
* filter: callback or object with acceptNode(), will be called for each node in the subtree
* based at root
*
*/
//const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, function(node) { return NodeFilter.FILTER_ACCEPT; }, false);
/*
const processNode = () => {
    console.log("Process node called");
    return NodeFilter.FILTER_ACCEPT;
};

const treeWalker = document.createTreeWalker(
                            document.body,
                            NodeFilter.SHOW_ALL,
                            processNode);

while (treeWalker.nextNode()) {

    console.log(treeWalker.currentNode);
}*/
