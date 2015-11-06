import highland from 'highland';

export default () => {
    let prev = undefined;

    return (err, curr, push, next) => {
        if (err) {
            push(err);
            next();
        } else if (curr === highland.nil) {
            if (prev !== undefined) {
                push(null, prev);
            }
            push(null, curr);
        } else {
            if (prev === undefined) {
                prev = curr;
                next();
            } else {
                if (prev.type && curr.type) {
                    prev.outnode = curr.id;
                }
                if (prev.type) {
                    push(null, prev);
                }
                prev = curr;
                next();
            }
        }
    };
}
