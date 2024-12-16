import re

class AnalisadorLexico:
    def __init__(self, codigo):  # Corrige el método __init__
        self.codigo = codigo
        self.tokens = []
        self.pos = 0
        self.especificaciones_tokens = [
            ('SI', r'\bif\b'),
            ('MIENTRAS', r'\bwhile\b'),
            ('ID', r'[a-zA-Z_][a-zA-Z0-9_]*'),
            ('NUMERO', r'\d+'),
            ('PAREN_IZQ', r'\('),
            ('PAREN_DER', r'\)'),
            ('LLAVE_IZQ', r'\{'),
            ('LLAVE_DER', r'\}'),
            ('IGUAL', r'='),
            ('PUNTO_Y_COMA', r';'),
            ('ESPACIO', r'[ \t\n]+'),
            ('NO_RECONOCIDO', r'.'),
        ]

    def tokenizar(self):
        token_re = '|'.join(f'(?P<{nombre}>{patron})' for nombre, patron in self.especificaciones_tokens)
        for coincidencia in re.finditer(token_re, self.codigo):
            tipo = coincidencia.lastgroup
            valor = coincidencia.group()
            if tipo == 'ESPACIO':
                continue
            elif tipo == 'NO_RECONOCIDO':
                raise SyntaxError(f'Carácter no válido: {valor}')
            else:
                self.tokens.append({'tipo': tipo, 'valor': valor})
        return self.tokens


class AnalisadorSintactico:
    def init(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def token_actual(self):
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None

    def coincidir(self, tipo_esperado):
        token = self.token_actual()
        if token and token['tipo'] == tipo_esperado:
            self.pos += 1
            return token
        raise SyntaxError(f"Se esperaba {tipo_esperado}, se obtuvo {token}")

    def analizar(self):
        while self.token_actual() is not None:
            self.analizar_declaracion()

    def analizar_declaracion(self):
        token = self.token_actual()
        if token['tipo'] == 'SI':
            self.analizar_si()
        elif token['tipo'] == 'MIENTRAS':
            self.analizar_mientras()
        elif token['tipo'] == 'ID':
            self.analizar_asignacion()
        else:
            raise SyntaxError(f"Token inesperado {token}")

    def analizar_si(self):
        self.coincidir('SI')
        self.coincidir('PAREN_IZQ')
        self.analizar_expresion()
        self.coincidir('PAREN_DER')
        self.coincidir('LLAVE_IZQ')
        self.analizar_bloque()
        self.coincidir('LLAVE_DER')

    def analizar_mientras(self):
        self.coincidir('MIENTRAS')
        self.coincidir('PAREN_IZQ')
        self.analizar_expresion()
        self.coincidir('PAREN_DER')
        self.coincidir('LLAVE_IZQ')
        self.analizar_bloque()
        self.coincidir('LLAVE_DER')

    def analizar_asignacion(self):
        self.coincidir('ID')
        self.coincidir('IGUAL')
        self.analizar_expresion()
        self.coincidir('PUNTO_Y_COMA')

    def analizar_expresion(self):
        token = self.token_actual()
        if token['tipo'] == 'NUMERO' or token['tipo'] == 'ID':
            self.coincidir(token['tipo'])
        else:
            raise SyntaxError(f"Se esperaba una expresión, se obtuvo {token}")

    def analizar_bloque(self):
        while self.token_actual() and self.token_actual()['tipo'] != 'LLAVE_DER':
            self.analizar_declaracion()