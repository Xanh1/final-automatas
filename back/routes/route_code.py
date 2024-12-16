from flask import Blueprint, make_response, request, jsonify
from controllers.controlador_codigo import ControladorCodigo
from routes.schemas.schema_codigo import schema_codigo
from flask_expects_json import expects_json

url_code = Blueprint('url_code', __name__)

controlador = ControladorCodigo()

@url_code.route('/code', methods = ['POST'])
@expects_json(schema_codigo)
def verify_code():
    
    json = request.json

    response = controlador.verificar_codigo(json['codigo'])

    return make_response(jsonify(response), response['code'])