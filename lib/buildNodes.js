export default (nodes, line) => {
    if (nodes.get(line.id) === undefined) {
        nodes.set(line.id, { id: line.id, type: line.type, weight: line.weight, outs: [] });
    }
    if (line.outnode) {
        nodes.get(line.id).outs.push({ label: line.outlabel, node: line.outnode });
    }
    return nodes;
}
