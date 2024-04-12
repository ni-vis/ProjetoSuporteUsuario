from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

usuarios = []

# Rota para listar todos os usuários
@app.route('/getall', methods=['GET'])
def lista_usuarios():
    return jsonify(usuarios)

# Rota para obter um usuário pelo código
@app.route('/<int:cpf>', methods=['GET'])
def get_usuarios(cpf):
  for usuario in usuarios:
    if usuario['cpf'] == cpf:
      return jsonify(usuario)
  return jsonify({"error": "Usuário não encontrado"}), 404

# Rota para adicionar um novo usuário
@app.route('/novo', methods=['POST'])
def add_usuario():
  nome_usuario = request.form['nome']
  setor_usuario = request.form['setor']
  descricao_usuario = request.form['descricao']
  data_usuario = request.form['dataHoje']
  cpf_usuario = request.form['cpf']
  for usuario in usuarios:
    if usuario['cpf'] == cpf_usuario:
      return jsonify({"message": "Usuário já tem cadastro!"}), 409
  else:
    id = len(usuarios) + 1
    novo_usuario = {"id": id, "cpf": cpf_usuario, "nome": nome_usuario, "setor": setor_usuario, "descricao": descricao_usuario, "dataHoje": data_usuario, "ativo": True}
    usuarios.append(novo_usuario)
    return jsonify({"message": "Reclamação cadastrada"}), 201

# Rota para alterar status do usuário
@app.route('/status/<int:id>')
def edt_status(id):
  for usuario in usuarios:
    if usuario['id'] == id:
      if usuario['ativo'] == True:
        usuario['ativo'] = False
      else:
        usuario['ativo'] = True
  return jsonify({"message": "Status alterado"}), 201      


# Rota para alterar informações do usuário
@app.route('/getid/<int:id>', methods=['GET'])
def get_chamados(id):
  for usuario in usuarios:
    if usuario['id'] == id:
      return jsonify(usuario)
  return jsonify({"error": "Usuário não encontrado"}), 404


# Rota para alterar informações do usuário
@app.route('/edtchamado/<int:id>', methods=['PUT'])
def alterar(id):
  nome_usuario = request.form['nome']
  setor_usuario = request.form['setor']
  descricao_usuario = request.form['descricao']
  data_usuario = request.form['dataHoje']
  cpf_usuario = request.form['cpf']
  comentario_usuario = request.form['comentario']
  for usuario in usuarios:
    if usuario['id'] == id:
      usuario['nome']=nome_usuario
      usuario['setor']=setor_usuario
      usuario['descricao']=descricao_usuario
      usuario['comentario']=comentario_usuario
      usuario['dataHoje']=data_usuario
      usuario['cpf']=cpf_usuario
  return jsonify({"message": "Alterações realizadas"}), 201

# Rota para excluir um usuário
@app.route('/deletar/<int:id>', methods=['DELETE'])
def deletar_usuario(id):
  for usuario in usuarios:
    if usuario['id'] == id:
      usuarios.remove(usuario)
      return jsonify({'message': 'Usuário deletado com sucesso'}), 200
  else:
    return jsonify({'error': 'Usuário não encontrado'}), 404

@app.route('/consulta/<string:cpf>', methods=['GET'])
def consulta_cpf(cpf):
  lista_temporaria = []
  for chamado in usuarios:
    if cpf == chamado["cpf"]:
      lista_temporaria.append(chamado)

  else:
    if lista_temporaria : 
        return jsonify(lista_temporaria)
    else:
      return jsonify({"error": "CPF não encontrado"}), 404



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)