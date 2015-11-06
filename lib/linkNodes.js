export default nodes => {
    nodes.forEach( node => {
        node.outs.forEach( out => {
            out.node = nodes.get(out.node);
        });
    });
    return nodes;
}
