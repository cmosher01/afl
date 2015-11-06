export default () => {
    let weight = 1.0;

    return node => {
        if (node.type.length > 0) {
            node.weight = weight;
        } else {
            weight /= 2;
        }
        return node;
    };
}
