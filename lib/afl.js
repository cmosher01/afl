import parse from './parse';
import addWeight from './addWeight';
import linkWithinFlow from './linkWithinFlow';
import buildNodes from './buildNodes';
import linkNodes from './linkNodes';
import arrangeNodes from './arrangeNodes';
import renderGraph from './renderGraph';

export default (stream) => {
    return stream
        .invoke('trim')
        .map(parse)
        .map(addWeight())
        .consume(linkWithinFlow())
        .reduce(new Map(), buildNodes)
        .map(linkNodes)
        .consume(arrangeNodes)
        .consume(renderGraph())
    ;
}
