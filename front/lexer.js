export class Lexer {

    constructor(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = this.input[this.position];
    }

    setInput(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = this.input[this.position];
    }

    advance() {
        this.position++;
        this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
    }

    skipWhitespace() {
        while (this.currentChar && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.currentChar && /[0-9]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return { type: 'NUMBER', value: result };
    }

    identifier() {
        let result = '';
        while (this.currentChar && /[a-zA-Z_]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        const keywords = [
            'int', 'float', 'char', 'double', 'if', 'else', 'for', 'while', 'return', 'void', 'struct', 'switch', 'case', 'default'
        ];

        if (keywords.includes(result)) {
            return { type: 'KEYWORD', value: result };
        }
        return { type: 'IDENTIFIER', value: result };
    }

    operator() {
        const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', ';', ',', '{', '}', '(', ')'];
        for (let op of operators) {
            if (this.input.startsWith(op, this.position)) {
                this.position += op.length - 1;
                this.currentChar = this.input[this.position];
                this.advance();
                return { type: 'OPERATOR', value: op };
            }
        }
        throw new Error(`Unknown operator: ${this.currentChar}`);
    }

    getNextToken() {
        while (this.currentChar) {
            if (/\s/.test(this.currentChar) && this.currentChar !== '\n') {
                // Esto maneja espacios y tabulaciones (pero no saltos de línea)
                let startPos = this.position;
                let whitespace = '';
                while (this.currentChar && /\s/.test(this.currentChar) && this.currentChar !== '\n') {
                    whitespace += this.currentChar;
                    this.advance();
                }
                return { type: 'WHITESPACE', value: whitespace, position: startPos };
            }
    
            if (this.currentChar === '\n') {
                // Esto maneja los saltos de línea específicamente
                let startPos = this.position;
                let newline = '\n';
                this.advance(); // Avanza para omitir el salto de línea
                return { type: 'NEWLINE', value: newline, position: startPos };
            }
        
            if (/[0-9]/.test(this.currentChar)) {
                return this.number(); // Directamente procesamos el número
            }
        
            if (/[a-zA-Z_]/.test(this.currentChar)) {
                return this.identifier();
            }
        
            return this.operator();
        }
        return { type: 'EOF', value: null };
    }
    
    
    
    tokenize() {
        const tokens = [];
        let token;
        do {
            token = this.getNextToken();
            tokens.push(token);
        } while (token.type !== 'EOF');
        return tokens;
    }
}
