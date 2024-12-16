from models.modelos import AnalisadorLexico, AnalisadorSintactico

def json_response(msg, code, context):
    return {
        'msg'  : msg,
        'code' : code,
        'context' : context,
    }

class ControladorCodigo:

    def verificar_codigo(self, codigo):
        print(codigo)
        try:
            lexer = AnalisadorLexico(codigo)
            tokens = lexer.tokenizar()

            parser = AnalisadorSintactico(tokens)
            parser.analizar()

            return json_response('OK', 200, 'El código no tiene errores léxicos ni sintácticos')
        
        except SyntaxError as e:
            return json_response('Error', 400, str(e))
        
        except Exception as e:
            return json_response('Error', 500, "Error de asdasd")