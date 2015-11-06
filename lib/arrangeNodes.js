import highland from 'highland';
import dagre from 'dagre';

const arrange = nodes => {
    var graph = new dagre.graphlib.Graph({ multigraph: true }).setGraph({});

    nodes.forEach( node => {
        node.width = 150;
        node.height = 50;
        if (node.type == "(") {
            node.height /= 2;
        }
        graph.setNode(node.id, node);
        node.outs.forEach( pnode => {
            graph.setEdge(node.id, pnode.node.id, { label: pnode.label, width: 75, height: 10, weight: node.weight }, pnode.label || {});
        });
    });

    dagre.layout(graph);

    return graph;
};

export default (err, nodes, push, next) => {
    if (err) {
        push(err);
        next();
    } else if (nodes === highland.nil) {
        push(null, highland.nil);
    } else {
        push(null, nodes);
        push(null, arrange(nodes));
        next();
    }
}
