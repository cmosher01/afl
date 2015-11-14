import highland from 'highland';
import XmlWriter from 'xml-writer';
import fs from 'fs';

const shape = Object.freeze(new Map([
    ["(", "terminal"],
    ["[", "process"],
    ["/", "io"],
    ["<", "decision"],
    ["|", "predefined"],
    ["~", "document"],
    ["{", "storage"],
    ["C", "comment"],
    ["$", "manual_input"],
    ["`", "manual_operation"],
    ["@", "display"],
]));

const POINT_SIZE = 10;
const w3 = "http://www.w3.org";

const line = (xw, p1, p2) => {
    xw.startElement("line");
        xw.writeAttribute("x1", p1.x);
        xw.writeAttribute("y1", p1.y);
        xw.writeAttribute("x2", p2.x);
        xw.writeAttribute("y2", p2.y);
        xw.writeAttribute("stroke", "black");
    xw.endElement();
};

const text = (xw, pt, label) => {
    if (label) {
        xw.startElement("text");
            xw.writeAttribute("x", pt.x).writeAttribute("y", pt.y+(POINT_SIZE/2));
            xw.writeAttribute("style", "text-anchor: middle");
            xw.writeAttribute("font-family", "Gill Sans, sans-serif");
            xw.text(label);
        xw.endElement();
    }
};

export default () => {

    let nodes = undefined;

    return (err, curr, push, next) => {
        if (err) {
            push(err);
            next();
        } else if (curr === highland.nil) {
            push(null, highland.nil);
        } else {
            if (nodes === undefined) {
                nodes = curr;
                next();
            } else {
                const graph = curr;
                const xw = new XmlWriter(true);



                xw.startDocument();

                xw.startElement("svg");
                xw.writeAttribute("xmlns", `${w3}/2000/svg`);
                xw.writeAttribute("xmlns:xlink", `${w3}/1999/xlink`);
                xw.writeAttribute("width", graph.graph().width);
                xw.writeAttribute("height", graph.graph().height);
                xw.writeAttribute("viewBox", `-8 -8 ${graph.graph().width+16} ${graph.graph().height+16}`);

                xw.writeRaw(fs.readFileSync("svg/afl.fragment", "UTF-8"));

                xw.startElement("defs");
                    xw.startElement("marker");
                        xw.writeAttribute("id", "arrow");
                        xw.writeAttribute("markerWidth", "10");
                        xw.writeAttribute("markerHeight", "10");
                        xw.writeAttribute("overflow", "visible");
                        xw.writeAttribute("orient", "auto");
                        xw.writeAttribute("markerUnits", "strokeWidth");
                            xw.startElement("path");
                                xw.writeAttribute("d", "m 0 0 l -9 -3 l 0 6 z");
                                xw.writeAttribute("fill", "black");
                            xw.endElement();
                    xw.endElement();
                xw.endElement();



                graph.edges().forEach(e => {
                    const edge = graph.edge(e);
                    xw.startElement("g");
                        line(xw, nodes.get(e.v), edge.points[0]);
                        xw.startElement("polyline");
                            xw.writeAttribute("points", edge.points.map(p => `${p.x} ${p.y}`).join(" "));
                            xw.writeAttribute("fill", "none");
                            xw.writeAttribute("stroke", "black");
                            if (nodes.get(e.v).type=="C" || nodes.get(e.w).type=="C") {
                                xw.writeAttribute("stroke-dasharray", "5 5");
                            } else {
                                xw.writeAttribute("marker-end", "url(#arrow)");
                            }
                        xw.endElement();
                        line(xw, edge.points[edge.points.length-1], nodes.get(e.w));
                        text(xw, edge, edge.label);
                    xw.endElement();
                });



                graph.nodes().forEach(iv => {
                    const v = graph.node(iv);
                    xw.startElement("g");
                        xw.startElement("use");
                            xw.writeAttribute("xlink:href", "#"+shape.get(v.type));
                            xw.writeAttribute("x", v.x-(v.width/2)).writeAttribute("y", v.y-(v.height/2));
                        xw.endElement();
                        text(xw,v,iv);
                    xw.endElement();
                });

                xw.endElement();

                xw.endDocument();



                highland(`${xw}`.split("\n")).each(s => push(null, s+"\n"));
                next();
            }
        }
};
}
