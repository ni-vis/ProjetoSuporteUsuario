function formatarData(data) {
  const dataObj = new Date(data)
  const dia = (dataObj.getDate() + 1).toString().padStart(2, '0')
  const mes = (dataObj.getMonth() ).toString().padStart(2, '0')
  const ano = dataObj.getFullYear().toString()
  return `${dia}/${mes}/${ano}`
}

// listarUsuarios(): Esta função é responsável por fazer uma requisição à API para obter a lista de usuários cadastrados. Em seguida, ela popula uma tabela HTML com os dados retornados pela API, incluindo opções para editar, excluir e alterar o status de cada usuário.

async function listarUsuarios() {
  const dados_tabela = document.getElementById("dados_tabela")
  apiUrl = 'http://127.0.0.1/getall'
  const response = await fetch(apiUrl)

  if (!response.ok) {
    alert('Usuários não cadastrados!')
  }
  else {
    const data = await response.json()
    for (const item of data) {

      const linha = document.createElement("tr") //cria uma nova linha
      const id = document.createElement("td") //cria uma nova coluna
      const nome = document.createElement("td")
      const setor = document.createElement("td")
      const descricao = document.createElement("td")
      const dataHoje = document.createElement("td")
      const cpf = document.createElement("td")
      const ativo = document.createElement("td")
      const editar = document.createElement("td")
      const excluir = document.createElement("td")

      id.textContent = item.id
      nome.textContent = item.nome
      setor.textContent = item.setor
      descricao.textContent = item.descricao
      dataHoje.textContent = formatarData(item.dataHoje)
      cpf.textContent = item.cpf


      if (item.ativo == true) {
        ativo.innerHTML = `<button onclick='alterarStatus(${item.id})'>Ativo</button>`
      } else {
        ativo.innerHTML = `<button onclick='alterarStatus(${item.id})'>Bloqueado</button>`
      }

      editar.innerHTML = `<button onclick='editaUsuario(${item.id})'>Editar</button>`
      excluir.innerHTML = `<button onclick='excluir(${item.id})'>Excluir</button>`

      linha.appendChild(id) //adiciona a coluna id como filha do elemento de linha
      linha.appendChild(nome)
      linha.appendChild(setor)
      linha.appendChild(descricao)
      linha.appendChild(dataHoje)
      linha.appendChild(cpf)
      linha.appendChild(ativo)
      linha.appendChild(editar)
      linha.appendChild(excluir)

      dados_tabela.appendChild(linha) //adiciona a linha como filha do elemento dados_tabela
    }
  }
}


// alterarStatus(id): Essa função é chamada quando o status de um usuário é alterado. Ela envia uma solicitação à API para atualizar o status do usuário com o ID fornecido.

async function alterarStatus(id) {
  const apiUrl = 'http://127.0.0.1/status/' + id
  const response = await fetch(apiUrl)
  if (response.status == 201) {
    console.log('Status alterado!')
  }
  location.reload() //atualiza a página atual no navegador
}

// enviarDados(event): Esta função é chamada quando os dados de um novo usuário são enviados por meio de um formulário. Ela envia os dados para a API através de uma solicitação POST para cadastrar o novo usuário.

async function enviarDados(event) {
  event.preventDefault()//método que bloqueia a ação padrão do formulário, que seria a de recarregar a página limpando os dados do formulário.

  const formData = new FormData(document.getElementById('formulario')) //cria um novo objeto FormData e preenche-o com os dados do formulário HTML 
  const response = await fetch('http://127.0.0.1/novo', {
    method: 'POST',
    body: formData
  })

  if (response.status == 201) {
    alert('Usuário cadastrado com sucesso!')
    window.location.href = "gestao.html"
    return true
  } else if (response.status == 409) {
    alert('Usuário já tem cadastro!')
    return false
  } else {
    alert('Falha ao cadastrar! Fale com o suporte')
    return false
  }
}

async function enviarDadosUsuario(event) {
  event.preventDefault()//método que bloqueia a ação padrão do formulário, que seria a de recarregar a página limpando os dados do formulário.

  const formData = new FormData(document.getElementById('formulario')) //cria um novo objeto FormData e preenche-o com os dados do formulário HTML 
  const response = await fetch('http://127.0.0.1/novo', {
    method: 'POST',
    body: formData
  })

  if (response.status == 201) {
    alert('Usuário cadastrado com sucesso!')
    window.location.href = "home.html"
    return true
  } else if (response.status == 409) {
    alert('Usuário já tem cadastro!')
    return false
  } else {
    alert('Falha ao cadastrar! Fale com o suporte')
    return false
  }
}

// validaCPF(): Esta função é utilizada para validar o CPF inserido em um campo de formulário. Ela verifica se o CPF possui apenas números e se possui 11 caracteres.

function validaCPF() {
  const cpf = document.getElementById('cpf').value

  // Verifica se todos os caracteres são números
  regex = /^\d+$/ //expressão regular utilizada para verificar se uma string contém apenas dígitos numéricos. Leia mais: https://www.w3schools.com/jsref/jsref_obj_regexp.asp
  if (!regex.test(cpf)) { //O método test() da expressão regular é usado para verificar se a string cpf corresponde à expressão regular regex. Ele retorna true se houver uma correspondência e false se não houver correspondência.
    alert("Informe somente números")
    return false
  }

  // Verifica se a string possui 11 caracteres
  if (cpf.length !== 11) {
    alert("O CPF precisa ter 11 números")
    return false
  }

  // Retorna true se o CPF for válido
  return true
}

// verificarUsuario(): Essa função verifica se um usuário com o CPF fornecido está cadastrado no sistema. Ela faz uma solicitação à API para obter informações sobre o usuário e exibe uma mensagem dependendo do status do usuário (ativo ou bloqueado).

async function verificarCPF() {
  try {
    const cpf_usuario = document.getElementById('cpf').value.trim()
    const resposta = document.getElementById('dados_tabela')
    const apiUrl = 'http://127.0.0.1/consulta/' + cpf_usuario
    const response = await fetch(apiUrl)
    console.log(response)
    if (!response.ok) {
      alert('Usuário não encontrado!')
    }
    else {

      const data = await response.json()
      console.log(data)
      for (const item of data) {

        const linha = document.createElement("tr") //cria uma nova linha
        const id = document.createElement("td") //cria uma nova coluna
        const nome = document.createElement("td")
        const setor = document.createElement("td")
        const descricao = document.createElement("td")
        const dataHoje = document.createElement("td")
        const cpf = document.createElement("td")
        const ativo = document.createElement("td")
        const comentario = document.createElement("td")

        id.textContent = item.id
        nome.textContent = item.nome
        setor.textContent = item.setor
        descricao.textContent = item.descricao
        dataHoje.textContent = formatarData(item.dataHoje)
        ativo.textContent = item.ativo
        cpf.textContent = item.cpf
        id.textContent = item.comentario
        
        linha.appendChild(id) //adiciona a coluna id como filha do elemento de linha
        linha.appendChild(nome)
        linha.appendChild(setor)
        linha.appendChild(descricao)
        linha.appendChild(dataHoje)
        linha.appendChild(cpf)
        linha.appendChild(comentario)
        linha.appendChild(ativo)
        

        dados_tabela.appendChild(linha)


      }
    }
  }
  catch (error) {
    console.error("API com problemas!")
  }
}



// editaUsuario(cpf): Esta função é chamada quando o usuário seleciona a opção de editar um usuário. Ela redireciona o usuário para uma página de edição com o CPF do usuário como parâmetro na URL.

async function editaUsuario(id) {
  const urlEditar = `edicao.html?id=${id}`
  window.location.href = urlEditar //permite redirecionar o navegador para o URL fornecido
}

// editarUsuario(cpf): Esta função é responsável por preencher um formulário de edição com os dados de um usuário existente. Ela faz uma solicitação à API para obter os dados do usuário com o CPF fornecido.

async function editarUsuario(id) {
  try {
    const id_chamado = id
    const apiUrl = 'http://127.0.0.1/getid/'  + id_chamado
    const response = await fetch(apiUrl)

    if (!response.ok) {
      alert('Usuário não encontrado!')
    }
    else {
      const data = await response.json()
      const nome = data.nome
      const setor = data.setor
      const descricao = data.descricao
      const dataHoje = data.dataHoje
      const cpf = data.cpf
      const id = data.id

      document.getElementById("nome").value = nome
      document.getElementById("setor").value = setor
      document.getElementById("descricao").value = descricao
      document.getElementById("dataHoje").value = dataHoje
      document.getElementById("cpf").value = cpf
      document.getElementById("id").value = id
    }
  }
  catch (error) {
    console.error("API com problemas!")
  }
}

// alterarDados(event): Esta função é chamada quando os dados de um usuário são alterados em um formulário de edição. Ela envia os dados atualizados para a API através de uma solicitação PUT para atualizar o usuário.

async function alterarDados(event) {
  event.preventDefault()

  const id = document.getElementById("id").value
  const apiUrl = 'http://127.0.0.1/editar/' + id
  const formData = new FormData(document.getElementById('formulario'))
  const response = await fetch(apiUrl, {
    method: 'PUT',
    body: formData
  })

  if (response.status == 201) {
    alert('Usuário alterado com sucesso!')
    window.location.href = "gestao.html"
    return true
  } else {
    alert('Falha ao alterar! Fale com o suporte')
    return false
  }
}


// excluir(id): Esta função é chamada quando um usuário é excluído. Ela envia uma solicitação à API para excluir o usuário com o ID fornecido.

async function excluir(id) {
  const apiUrl = 'http://127.0.0.1/deletar/' + id
  const response = await fetch(apiUrl, { method: 'DELETE' })

  if (response.status == 200) {
    alert('Usuário deletado com sucesso!')
    window.location.href = "gestao.html"
    return true
  } else {
    alert('Falha ao excluir! Fale com o suporte')
    return false
  }
}

