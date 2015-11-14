export default line => {
    const closeSymbol = Object.freeze(new Map([
        ["(", ")"],
        ["[", "]"],
        ["/", "/"],
        ["<", ">"],
        ["|", "|"],
        ["~", "~"],
        ["{", "}"],
        ["C", "C"],
        ["$", "$"],
        ["`", "`"],
        ["@", "@"],
    ]));

    const r = { id: "", type: "", outlabel: "" };

    const START = 0, ID = 1, LABEL = 2;
    let state = START;

    let closing;

    if (line !== ".") {
        for (const c of line) {
            if (state == START) {
                closing = closeSymbol.get(c);
                if (closing === undefined) {
                    throw new Error("syntax error: "+c);
                }
                r.type = c;
                state = ID;
            } else if (state == ID) {
                if (c == closing) {
                    state = LABEL;
                } else {
                    r.id += c;
                }
            } else if (state == LABEL) {
                r.outlabel += c;
            }
        }
    }
    r.id = r.id.trim();
    r.outlabel = r.outlabel.trim();

    return r;
}
