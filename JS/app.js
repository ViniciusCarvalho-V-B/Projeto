document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const API_URL = 'http://localhost:3000'; 

  if (path.includes('cadastrar-produto.html')) initCadastroProduto(API_URL);
  else if (path.includes('cadastrar-fornecedor.html')) initCadastroFornecedor(API_URL);
  else if (path.includes('criar-pedido.html')) initCriarPedido(API_URL);
  else if (path.includes('consultar-pedidos.html')) initConsultaPedidos(API_URL);
});

function mostrarMensagem(mensagem, tipo, elementoId = 'mensagem') {
  const div = document.getElementById(elementoId);
  if (!div) return;
  div.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>`;
}

async function fetchComTratamentoDeErro(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `Erro HTTP: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        // Pega erros de rede (Failed to fetch) e erros da resposta
        console.error('Falha na requisição:', error);
        throw new Error(error.message === 'Failed to fetch' ? 'Falha ao conectar com o servidor. Verifique se ele está rodando.' : error.message);
    }
}

function initCadastroProduto(API_URL) {
  const form = document.getElementById('form-produto');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const produtoData = {
      nome: form.nome.value.trim(),
      categoria: form.categoria.value.trim(),
      preco: parseFloat(form.preco.value),
      estoque: parseInt(form.estoque.value),
    };

    if (!produtoData.nome || !produtoData.categoria) return mostrarMensagem('Nome e Categoria são obrigatórios.', 'danger');
    if (isNaN(produtoData.preco) || produtoData.preco <= 0) return mostrarMensagem('O Preço deve ser um número maior que zero.', 'danger');
    if (isNaN(produtoData.estoque) || produtoData.estoque < 0) return mostrarMensagem('O Estoque deve ser um número igual ou maior que zero.', 'danger');

    try {
      await fetchComTratamentoDeErro(`${API_URL}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoData),
      });
      mostrarMensagem('Produto cadastrado com sucesso!', 'success');
      form.reset();
    } catch (error) {
      mostrarMensagem(error.message, 'danger');
    }
  });
}

function initCadastroFornecedor(API_URL) {
  const form = document.getElementById('form-fornecedor');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fornecedorData = {
      nome: form.querySelector('#nomeFornecedor').value.trim(),
      cnpj: form.querySelector('#cnpj').value.trim(),
      cidade: form.querySelector('#cidade').value.trim(),
    };

    if (!fornecedorData.nome || !fornecedorData.cnpj || !fornecedorData.cidade) return mostrarMensagem('Todos os campos são obrigatórios.', 'danger');
    if (fornecedorData.cnpj.replace(/\D/g, '').length !== 14) return mostrarMensagem('CNPJ inválido. Deve conter 14 dígitos.', 'danger');

    try {
      await fetchComTratamentoDeErro(`${API_URL}/fornecedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fornecedorData),
      });
      mostrarMensagem('Fornecedor cadastrado com sucesso!', 'success');
      form.reset();
    } catch (error) {
      mostrarMensagem(error.message, 'danger');
    }
  });
}

async function initCriarPedido(API_URL) {
  const form = document.getElementById('form-pedido');
  const produtoSelect = document.getElementById('produto');
  const fornecedorSelect = document.getElementById('fornecedor');
  if (!form) return;

  try {
    const [produtos, fornecedores] = await Promise.all([
      fetchComTratamentoDeErro(`${API_URL}/produtos`),
      fetchComTratamentoDeErro(`${API_URL}/fornecedores`),
    ]);
    produtos.forEach(p => produtoSelect.add(new Option(p.nome, p.codigo)));
    fornecedores.forEach(f => fornecedorSelect.add(new Option(f.nome, f.id)));
  } catch (error) {
    mostrarMensagem(error.message, 'danger');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pedidoData = {
      id_produto: form.produto.value,
      id_fornecedor: form.fornecedor.value,
      quantidade: parseInt(form.quantidadePedido.value),
      data: form.data.value,
    };

    if (!pedidoData.id_produto || !pedidoData.id_fornecedor) return mostrarMensagem('Selecione um Produto e um Fornecedor.', 'danger');
    if (isNaN(pedidoData.quantidade) || pedidoData.quantidade <= 0) return mostrarMensagem('A Quantidade deve ser um número maior que zero.', 'danger');
    if (!pedidoData.data) return mostrarMensagem('A Data do pedido é obrigatória.', 'danger');

    try {
      await fetchComTratamentoDeErro(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      });
      mostrarMensagem('Pedido criado com sucesso!', 'success');
      form.reset();
    } catch (error) {
      mostrarMensagem(error.message, 'danger');
    }
  });
}

async function initConsultaPedidos(API_URL) {
  const form = document.getElementById('form-filtro');
  const tabelaBody = document.getElementById('tabela-pedidos');
  const produtoFiltro = document.getElementById('filtro-produto');
  const fornecedorFiltro = document.getElementById('filtro-fornecedor');
  if (!form) return;

  try {
    const [produtos, fornecedores] = await Promise.all([
      fetchComTratamentoDeErro(`${API_URL}/produtos`),
      fetchComTratamentoDeErro(`${API_URL}/fornecedores`),
    ]);
    produtos.forEach(p => produtoFiltro.add(new Option(p.nome, p.codigo)));
    fornecedores.forEach(f => fornecedorFiltro.add(new Option(f.nome, f.id)));
  } catch (error) {
    mostrarMensagem(error.message, 'warning', 'mensagem-consulta');
  }
  
  const carregarPedidos = async (params) => {
    const query = new URLSearchParams(params).toString();
    try {
        const pedidos = await fetchComTratamentoDeErro(`${API_URL}/pedidos?${query}`);
        tabelaBody.innerHTML = '';
        if (pedidos.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum pedido encontrado.</td></tr>';
            return;
        }
        pedidos.forEach(p => {
            const row = `
            <tr>
                <td>${p.id}</td>
                <td>${p.produto_nome ?? 'N/A'}</td>
                <td>${p.fornecedor_nome ?? 'N/A'}</td>
                <td>${p.quantidade}</td>
                <td>${new Date(p.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
            </tr>`;
            tabelaBody.innerHTML += row;
        });
    } catch (error) {
        mostrarMensagem(error.message, 'danger', 'mensagem-consulta');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const filtros = {
      data: form.querySelector('input[type="date"]').value,
      produto: form.querySelector('#filtro-produto').value,
      fornecedor: form.querySelector('#filtro-fornecedor').value,
    };
    Object.keys(filtros).forEach(key => !filtros[key] && delete filtros[key]);
    carregarPedidos(filtros);
  });

  carregarPedidos({});
}