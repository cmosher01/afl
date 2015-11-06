export default nodes => {
    nodes.forEach( (node, id) => {
        console.log("================================");
        console.log("%s: %s", id, node.type);
        node.outs.forEach( pnode => {
            console.log("    ----------------------------");
            console.log("    \"%s\": %s", pnode.label, pnode.node.id || pnode.node);
        });
    });
}
