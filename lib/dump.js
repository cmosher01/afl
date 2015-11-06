export default object => {
    if (typeof object === 'string') {
        console.error('[object String]: "%s"', object);
    } else {
        console.error("%s: %o", ({}).toString.call(object), object);
    }
}
