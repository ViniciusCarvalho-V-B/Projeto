document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('cadastrar-produto.html')) initCadastroProduto();
  else if (path.includes('cadastrar-fornecedor.html')) initCadastroFornecedor();
  else if (path.includes('criar-pedido.html')) initCriarPedido();
  else if (path.includes('consultar-pedidos.html')) initConsultaPedidos();
});

function initCadastroProduto() {
  const form = document.getElementById('form-produto');
  const msg = document.getElementById('mensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
      nome: form.nome.value,
      descricao: form.descricao.value,
      preco: form.preco.value,
      quantidade: form.quantidade.value
    };

    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const texto = await res.text();
    msg.innerText = texto;
  });
}

function initCadastroFornecedor() {
  const form = document.getElementById('form-fornecedor');
  const msg = document.getElementById('mensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
      nome: form.nome.value,
      cnpj: form.cnpj.value,
      telefone: form.telefone.value,
      email: form.email.value
    };

    const res = await fetch('/fornecedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const texto = await res.text();
    msg.innerText = texto;
  });
}

function initCriarPedido() {
  const form = document.getElementById('form-pedido');
  const msg = document.getElementById('mensagem');

  // Carrega produtos e fornecedores nos selects
  async function carregarSelects() {
    const [produtos, fornecedores] = await Promise.all([
      fetch('/produtos').then(r => r.json()),
      fetch('/fornecedores').then(r => r.json())
    ]);

    const selProduto = form.produto;
    const selFornecedor = form.fornecedor;

    produtos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.nome;
      selProduto.appendChild(opt);
    });

    fornecedores.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = f.nome;
      selFornecedor.appendChild(opt);
    });
  }

  carregarSelects();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
      id_produto: form.produto.value,
      id_fornecedor: form.fornecedor.value,
      quantidade: form.quantidade.value,
      data: form.data.value
    };

    const res = await fetch('/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const texto = await res.text();
    msg.innerText = texto;
  });
}

function initConsultaPedidos() {
  const form = document.getElementById('form-filtro');
  const tabela = document.getElementById('tabela-pedidos');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(form)).toString();

    const res = await fetch(`/pedidos?${params}`);
    const pedidos = await res.json();

    tabela.innerHTML = '';

    pedidos.forEach(p => {
      const row = `<tr>
        <td>${p.id}</td>
        <td>${p.produto}</td>
        <td>${p.fornecedor}</td>
        <td>${p.quantidade}</td>
        <td>${p.data}</td>
      </tr>`;
      tabela.innerHTML += row;
    });
  });
}
