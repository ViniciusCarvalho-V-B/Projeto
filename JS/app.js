document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('cadastrar-produto.html')) initCadastroProduto();
  else if (path.includes('cadastrar-fornecedor.html')) initCadastroFornecedor();
  else if (path.includes('criar-pedido.html')) initCriarPedido();
  else if (path.includes('consultar-pedidos.html')) initConsultaPedidos();
});

// Banco de dados SIMULADO (em memória)
const db = {
  produtos: [
    { id: 1, nome: "Notebook", descricao: "Dell Inspiron 15", preco: 3500, quantidade: 10 },
    { id: 2, nome: "Mouse", descricao: "Sem fio", preco: 120, quantidade: 50 }
  ],
  fornecedores: [
    { id: 1, nome: "Fornecedor A", cnpj: "12345678000100", telefone: "11999998888", email: "fornecedorA@email.com" }
  ],
  pedidos: [
    { id: 1, produto: "Notebook", fornecedor: "Fornecedor A", quantidade: 5, data: "2025-06-01" }
  ]
};

function mostrarMensagem(mensagem, tipo, elementoId = 'mensagem') {
  const div = document.getElementById(elementoId);
  if (!div) return;
  div.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;
}

// Validações
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;
  // Validação simplificada (para frontend)
  return true;
}

function validarTelefone(telefone) {
  telefone = telefone.replace(/\D/g, '');
  return telefone.length >= 10 && telefone.length <= 11;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== CADASTRO DE PRODUTO =====
function initCadastroProduto() {
  const form = document.getElementById('form-produto');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const descricao = form.descricao.value.trim();
    const preco = parseFloat(form.preco.value);
    const quantidade = parseInt(form.quantidade.value);

    if (!nome || nome.length < 3) {
      mostrarMensagem('Nome do produto deve ter pelo menos 3 caracteres.', 'danger');
      return;
    }
    if (isNaN(preco) || preco <= 0) {
      mostrarMensagem('Preço inválido. Deve ser maior que zero.', 'danger');
      return;
    }
    if (isNaN(quantidade) || quantidade <= 0) {
      mostrarMensagem('Quantidade inválida. Deve ser maior que zero.', 'danger');
      return;
    }

    const novoProduto = {
      id: db.produtos.length + 1,
      nome,
      descricao,
      preco,
      quantidade
    };
    db.produtos.push(novoProduto);
    mostrarMensagem('Produto cadastrado com sucesso!', 'success');
    form.reset();
  });
}

// ===== CADASTRO DE FORNECEDOR =====
function initCadastroFornecedor() {
  const form = document.getElementById('form-fornecedor');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nomeFornecedor.value.trim();
    const cnpj = form.cnpj.value.trim().replace(/[^\d]+/g, '');
    const telefone = form.telefone.value.trim().replace(/\D/g, '');
    const email = form.email.value.trim();

    if (!nome || nome.length < 3) {
      mostrarMensagem('Nome deve ter pelo menos 3 caracteres.', 'danger');
      return;
    }
    if (!validarCNPJ(cnpj)) {
      mostrarMensagem('CNPJ inválido.', 'danger');
      return;
    }
    if (!validarTelefone(telefone)) {
      mostrarMensagem('Telefone inválido. Insira DDD + número (10 ou 11 dígitos).', 'danger');
      return;
    }
    if (!validarEmail(email)) {
      mostrarMensagem('Email inválido.', 'danger');
      return;
    }

    const novoFornecedor = {
      id: db.fornecedores.length + 1,
      nome,
      cnpj,
      telefone,
      email
    };
    db.fornecedores.push(novoFornecedor);
    mostrarMensagem('Fornecedor cadastrado com sucesso!', 'success');
    form.reset();
  });
}

// ===== CRIAR PEDIDO =====
function initCriarPedido() {
  const form = document.getElementById('form-pedido');
  if (!form) return;

  // Preenche dropdowns (código anterior...)

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const produtoId = parseInt(form.produto.value);
    const fornecedorId = parseInt(form.fornecedor.value);
    const quantidade = parseInt(form.quantidadePedido.value);
    const data = form.data.value;

    // Validações reforçadas
    if (isNaN(produtoId)) {
      mostrarMensagem('❌ Selecione um produto válido.', 'danger', 'mensagem');
      form.produto.focus();
      return;
    }
    if (isNaN(fornecedorId)) {
      mostrarMensagem('❌ Selecione um fornecedor válido.', 'danger', 'mensagem');
      form.fornecedor.focus();
      return;
    }
    if (isNaN(quantidade) || quantidade <= 0) {
      mostrarMensagem('❌ Quantidade inválida. Insira um número maior que zero.', 'danger', 'mensagem');
      form.quantidadePedido.focus();
      return;
    }
    if (!data) {
      mostrarMensagem('❌ Selecione uma data válida.', 'danger', 'mensagem');
      form.data.focus();
      return;
    }

    // Simulação de sucesso
    mostrarMensagem('✅ Pedido criado com sucesso!', 'success', 'mensagem');
    form.reset();
  });
}

// ===== CONSULTAR PEDIDOS =====
function initConsultaPedidos() {
  const form = document.getElementById('form-filtro');
  const tabela = document.getElementById('tabela-pedidos');
  if (!form || !tabela) return;

  // Preenche dropdowns (código anterior...)

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const produto = form.querySelector('#filtro-produto').value;
    const fornecedor = form.querySelector('#filtro-fornecedor').value;
    const data = form.querySelector('input[type="date"]').value;

    // Simulação: filtro sem resultados
    if (!produto && !fornecedor && !data) {
      mostrarMensagem('⚠️ Selecione pelo menos um filtro.', 'warning', 'mensagem-consulta');
      return;
    }

    // Mensagem de sucesso (simulada)
    mostrarMensagem('🔍 Filtros aplicados com sucesso.', 'success', 'mensagem-consulta');
  });
}


