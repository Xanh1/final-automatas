import { Lexer } from './lexer.js';

const lexer = new Lexer("");
const input = document.getElementById('input');
const output = document.getElementById('output');

const btnCompiler = document.getElementById('btn-compilar');

btnCompiler.addEventListener('click', async () => {

    const code = input.value; // Obtiene el valor del input
    const requestBody = { codigo: code };

    try {
        // Realiza la petición al backend
        const response = await fetch('http://127.0.0.1:5000/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log(response)

        if (response.code === 200){
            output.innerHTML = `<span class="success">${response.context}</span>`;
        } else {
            output.innerHTML = `<span class="error">${response.context}</span>`;
        }

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

    } catch (error) {
        console.error('Error en la petición al backend:', error.context);
    }

});

input.addEventListener('input', () => {
    const text = input.value;

    lexer.setInput(text);

    const tokens = lexer.tokenize();

    let formattedContent = '';
    let lastNewline = false;

    tokens.forEach(token => {
        if (token.type === 'EOF') return;

        if (token.type === 'INVALID') {
            formattedContent += `<span class="error">${token.value}</span>`;
        } else if (token.type === 'KEYWORD') {
            formattedContent += `<span class="highlight">${token.value}</span>`;
        } else if (token.type === 'OPERATOR') {
            formattedContent += `<span class="operator">${token.value}</span>`;
        } else if (token.type === 'NUMBER') {
            formattedContent += `<span class="number">${token.value}</span>`;
        } else if (token.type === 'WHITESPACE') {
            formattedContent += token.value.replace(/ /g, '&nbsp;');
        } else if (token.type === 'NEWLINE') {
            formattedContent += '<br>';
            lastNewline = true;
        } else {
            formattedContent += token.value;
        }
    });

    output.innerHTML = formattedContent;
});
