const editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow");
editor.session.setMode("ace/mode/c_cpp");

let markers = [];

function lexer(input) {
    const tokens = [];
    const tokenRegex = /\b(int|float|char|if|else|for|while|return|void)\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|\b\d+(\.\d+)?\b|[{}();=+\-*/<>!&|]|".*?"|\/\/.*|\/\*[\s\S]*?\*\//g;
    let match;
    while ((match = tokenRegex.exec(input)) !== null) {
        tokens.push({
            type: identifyTokenType(match[0]),
            value: match[0],
        });
    }
    return tokens;
}

function identifyTokenType(token) {
    if (/\b(int|float|char|if|else|for|while|return|void)\b/.test(token)) return "KEYWORD";
    if (/\b[a-zA-Z_][a-zA-Z0-9_]*\b/.test(token)) return "IDENTIFIER";
    if (/\b\d+(\.\d+)?\b/.test(token)) return "NUMBER";
    if (/[{}();=+\-*/<>!&|]/.test(token)) return "SYMBOL";
    if (/".*?"/.test(token)) return "STRING";
    if (/\/\/.*|\/\*[\s\S]*?\*\//.test(token)) return "COMMENT";
    return "UNKNOWN";
}

function parser(tokens) {
    const stack = [];
    let errors = [];
    tokens.forEach((token, index) => {
        if (token.type === "SYMBOL" && token.value === "{") stack.push(index);
        if (token.type === "SYMBOL" && token.value === "}") {
            if (stack.length === 0 || tokens[stack.pop()].value !== "{") {
                errors.push({ type: "Unmatched closing brace", index });
            }
        }
    });
    if (stack.length > 0) {
        errors.push({ type: "Unmatched opening brace", index: stack.pop() });
    }
    return errors;
}

function highlightErrors(errors) {
    // Remove previous markers
    markers.forEach(marker => editor.session.removeMarker(marker));
    markers = [];
    
    // Add new markers for errors
    errors.forEach(error => {
        const range = new ace.Range(error.index, 0, error.index, 100);
        const marker = editor.session.addMarker(range, "error-marker", "text");
        markers.push(marker);
    });
}

editor.session.on('change', () => {
    const code = editor.getValue();
    const outputDiv = document.getElementById("output");
    try {
        const tokens = lexer(code);
        const parseErrors = parser(tokens);
        if (parseErrors.length > 0) {
            highlightErrors(parseErrors);
            outputDiv.textContent = `Syntax errors:\n${JSON.stringify(parseErrors, null, 2)}`;
        } else {
            highlightErrors([]);
            outputDiv.textContent = `Code structure is valid!`;
        }
    } catch (error) {
        outputDiv.textContent = `Error:\n${error.message}`;
    }
});
