
import pug from 'pug';
import { jsx as _jsx } from "react/jsx-runtime";
import { renderToString } from 'react-dom/server';
import React from 'react';

/*
 * Were server rendering react here, either as a full replacement
 * for client side rendering or as hybrid
 */
export const hybridRenderView = (template: string, app: React.JSX.Element | React.ElementType<any, any>,
                           templateLocals: any, appLocals: Record<string, unknown>) => {


    const pugRender = pug.compileFile("./client/views/"+template);
    const html = pugRender(templateLocals);

    const reactRender = renderToString(_jsx(app, { data: appLocals }));
    const htmlRender = html.replace("<main id=\"root\"></main>", `<main id="root">${reactRender}</main>`);
    return htmlRender;
}

//Render the server and tell the client not to render
//NOT IMPLEMENTED ON CLIENT SIDE YET
export const serverRenderView = (template: string, app: React.JSX.Element | React.ElementType<any, any>,
                                 templateLocals: any, appLocals: Record<string, unknown>) => {

    templateLocals["bodyClass"] = "static";
    return hybridRenderView(template, app, templateLocals, appLocals);
}
