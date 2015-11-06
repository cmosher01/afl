import parse from './parse';
import addWeight from './addWeight';
import linkWithinFlow from './linkWithinFlow';
import buildNodes from './buildNodes';
import linkNodes from './linkNodes';
import arrangeNodes from './arrangeNodes';
import renderGraph from './renderGraph';

import logNode from './logNode';
import dumpNodeMap from './dumpNodeMap';
import dumpGraph from './dumpGraph';

export default (stream) => {
    return stream
        .invoke('trim')
        // .tap(logNode)
        .map(parse)
        .map(addWeight())
        .consume(linkWithinFlow())
        .reduce(new Map(), buildNodes)
        // .tap(dumpNodeMap)
        .map(linkNodes)
        .consume(arrangeNodes)
        // .tap(dumpGraph)
        .consume(renderGraph())
    ;
}
