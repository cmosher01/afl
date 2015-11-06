export default graph => {
    if (typeof graph.nodes === "function") {
        graph.nodes().forEach(v => {
            console.log("Node %s: %o", v, graph.node(v));
        });
        graph.edges().forEach(e => {
            console.log("Edge %o: %o", e, graph.edge(e));
        });
    }
}
