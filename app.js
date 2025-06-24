document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("cadastrar-produto.html")) initCadastroProduto();
  else if (path.includes("cadastrar-fornecedor.html")) initCadastroFornecedor();
  else if (path.includes("criar-pedido.html")) initCriarPedido();
  else if (path.includes("consultar-pedidos.html")) initConsultaPedidos();
});

function exibirMensagem(id, texto, tipo = "success") {
  const container = document.getElementById(id);
  container.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;
}

function initCadastroProduto() {
  const form = document.getElementById("form-produto");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const descricao = form.descricao.value.trim();
    const preco = parseFloat(form.preco.value);
    const quantidade = parseInt(form.quantidade.value);

    if (!nome || !descricao || isNaN(preco) || preco <= 0 || isNaN(quantidade) || quantidade <= 0) {
      exibirMensagem("mensagem", "Preencha todos os campos corretamente.", "danger");
      return;
    }

    try {
      const res = await fetch("/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descricao, preco, quantidade })
      });
      const texto = await res.text();
      exibirMensagem("mensagem", texto || "Produto cadastrado com sucesso!");
      form.reset();
    } catch {
      exibirMensagem("mensagem", "Erro ao cadastrar produto.", "danger");
    }
  });
}

function initCadastroFornecedor() {
  const form = document.getElementById("form-fornecedor");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const cnpj = form.cnpj.value.trim();
    const telefone = form.telefone.value.trim();
    const email = form.email.value.trim();

    if (!nome || !cnpj || !telefone || !email.includes("@")) {
      exibirMensagem("mensagem", "Preencha os dados corretamente.", "danger");
      return;
    }

    try {
      const res = await fetch("/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cnpj, telefone, email })
      });
      const texto = await res.text();
      exibirMensagem("mensagem", texto || "Fornecedor cadastrado com sucesso!");
      form.reset();
    } catch {
      exibirMensagem("mensagem", "Erro ao cadastrar fornecedor.", "danger");
    }
  });
}

function initCriarPedido() {
  const form = document.getElementById("form-pedido");

  async function carregarSelects() {
    const [produtos, fornecedores] = await Promise.all([
      fetch("/produtos").then(r => r.json()),
      fetch("/fornecedores").then(r => r.json())
    ]);

    produtos.forEach(p => {
      const opt = new Option(p.nome, p.id);
      form.produto.appendChild(opt);
    });

    fornecedores.forEach(f => {
      const opt = new Option(f.nome, f.id);
      form.fornecedor.appendChild(opt);
    });
  }

  carregarSelects();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id_produto = form.produto.value;
    const id_fornecedor = form.fornecedor.value;
    const quantidade = parseInt(form.quantidade.value);
    const data = form.data.value;

    if (!id_produto || !id_fornecedor || isNaN(quantidade) || quantidade <= 0 || !data) {
      exibirMensagem("mensagem", "Verifique todos os campos.", "danger");
      return;
    }

    try {
      const res = await fetch("/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_produto, id_fornecedor, quantidade, data })
      });
      const texto = await res.text();
      exibirMensagem("mensagem", texto || "Pedido criado com sucesso!");
      form.reset();
    } catch {
      exibirMensagem("mensagem", "Erro ao criar pedido.", "danger");
    }
  });
}

function initConsultaPedidos() {
  const form = document.getElementById("form-filtro");
  const tabela = document.getElementById("tabela-pedidos");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(form)).toString();

    try {
      const res = await fetch(`/pedidos?${params}`);
      const pedidos = await res.json();

      tabela.innerHTML = "";

      if (pedidos.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5">Nenhum pedido encontrado.</td></tr>';
        return;
      }

      pedidos.forEach(p => {
        tabela.innerHTML += `
          <tr>
            <td>${p.id}</td>
            <td>${p.produto}</td>
            <td>${p.fornecedor}</td>
            <td>${p.quantidade}</td>
            <td>${p.data}</td>
          </tr>
        `;
      });
    } catch {
      tabela.innerHTML = '<tr><td colspan="5" class="text-danger">Erro ao buscar pedidos.</td></tr>';
    }
  });
}
