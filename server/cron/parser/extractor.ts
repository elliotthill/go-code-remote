type TextTree = {
    type: "block" | "text" | undefined;
    text: string | undefined;
    fontSize: number | undefined;
    styles: {border:number} | undefined;
    debug: Node | undefined;
    children: TextTree[];
    parent: TextTree | undefined;
};

export const extract = () => {

    const TITLE_THRESHOLD_FONT_SIZE = 16;

    let textTree: TextTree = {};

    const walk = (node: Node, func: (node: Node, textTree:TextTree) => void, textTree: TextTree) => {
        const children = node.childNodes;
        func(node, textTree);

        textTree.children = [];

        for (var i = 0; i < children.length; i++) { // Children are siblings to each other
            textTree.children[i] = {parent:textTree};
            walk(children[i], func, textTree.children[i]);
        }
    }

    const clean = (tree: TextTree) => {

        for (const [i, item] of tree.children.entries()) {
            if (!item.type)
                delete tree.children[i];
            else if (item.type === "block" && !item.children)
                delete tree.children[i];
            else if (item.children.length > 0) {
                clean(item);
            } else {
                //delete item.children;
            }
        }
    }

    const isEmpty = (str:string) => !str.replace(/\s/g, '').length

    const getStyle = (node: Node, style:string):string => {

        return getComputedStyle(node).getPropertyValue(style).replace("px","");
    }

    const getStylePx = (node: Node, style:string):number => {

        return parseInt(getStyle(node, style)) || 0;
    }

    const nodeProc = (node: Node, appendTo: TextTree) => {

        if (node.nodeType === Node.ELEMENT_NODE) {
            appendTo.fontSize = getStylePx(node, "font-size");
            appendTo.debug = node;
            appendTo.type = "block";

            appendTo.styles = {
                border: getStylePx(node, "border-bottom-width"),
            };
        }

        if (node.nodeType === Node.TEXT_NODE && !isEmpty(node.textContent)) {
            appendTo.text = node.textContent;
            appendTo.debug = node;
            appendTo.type = "text";
        }
    }



    //Applies Styles onto every child element.
    //So every text element will have a font size now.
    const cascade = (tree: TextTree, parent: TextTree | null) => {

        for (const child of tree.children) {

            if (child === undefined)
                continue;

            if (child.type === 'block') {
                parent = child;
            } else if (child.type === 'text') {
                if (parent) {
                    child.fontSize = parent.fontSize;
                }
            }
            if (child.children)
            cascade(child, parent);
        }
    }

    let titles:TextTree[] = [];
    const titleIfy = (tree: TextTree) => {

        for (const child of tree.children) {

            if (child === undefined)
                continue;

            if (child.type === 'text' && child.fontSize > TITLE_THRESHOLD_FONT_SIZE) {
                titles.push(child);
            }

            if (child.children)
                titleIfy(child);
        }
    }


    let containers: Container[] = [];
    type Container = {
        title: TextTree;
        container: TextTree;
    }

    let flatContainers: FlatContainer[] = [];
    type FlatContainer = {
        title: string;
        content: string;
    }

    const containerize = (titles: TextTree[]) => {

        const findParentContainer = (tree: TextTree): TextTree | undefined => {

            if (tree.parent === undefined)
                return undefined;

            if (tree.parent.styles !== undefined && tree.parent.styles.border > 0)
                return tree.parent;

            return findParentContainer(tree.parent);
        }

        const containerRollupText = (container: TextTree, content: {text: string}) => {

            for (const child of container.children) {

                if (child === undefined)
                    continue;

                if (child.text)
                    content.text += child.text;


                containerRollupText(child, content);
            }

        }

        for (const child of titles) {

            if (child === undefined)
                continue;

            const container = findParentContainer(child);
            if (container)
                containers.push({title:child, container: container});
        }

        for (const {title,container} of containers) {

            if (!title.text)
                continue;

            let content = {text:""}; //So we can pass by ref
            containerRollupText(container, content);

            let thisContainer: FlatContainer = {
                title: title.text,
                content:content.text,
            }


            flatContainers.push(thisContainer);

        }

    }


    walk(document.body, nodeProc, textTree); //Prints out every node
    //clean(textTree);
    cascade(textTree, null);
    titleIfy(textTree);
    containerize(titles);

    console.log(titles);
    console.log(flatContainers);
    return Promise.resolve(flatContainers);
}
