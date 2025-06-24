import express from 'express';
import cors from 'cors';
import pool from './db/connection.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('Servidor Comercial Alfa está no ar!');
});

// --- ROTAS DOS PRODUTOS ---
app.get('/produtos', async (req, res) => {
  try {
    console.log("Recebida requisição GET para /produtos");
    const [produtos] = await pool.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch (err) {
    console.error("Erro em GET /produtos:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const { nome, categoria, preco, estoque } = req.body;
    console.log("Recebida requisição POST para /produtos com dados:", req.body);
    const sql = 'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [nome, categoria, preco, estoque]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Erro em POST /produtos:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- ROTAS DOS FORNECEDORES ---
app.get('/fornecedores', async (req, res) => {
  try {
    console.log("Recebida requisição GET para /fornecedores");
    const [fornecedores] = await pool.query('SELECT * FROM fornecedores');
    res.json(fornecedores);
  } catch (err) {
    console.error("Erro em GET /fornecedores:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/fornecedores', async (req, res) => {
  try {
    const { nome, cnpj, cidade } = req.body;
    console.log("Recebida requisição POST para /fornecedores com dados:", req.body);
    const sql = 'INSERT INTO fornecedores (nome, cnpj, cidade) VALUES (?, ?, ?)';
    // Limpa o CNPJ para salvar apenas números, se desejar
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const [result] = await pool.query(sql, [nome, cnpjLimpo, cidade]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Erro em POST /fornecedores:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- ROTAS DOS PEDIDOS ---
app.get('/pedidos', async (req, res) => {
  try {
    console.log("Recebida requisição GET para /pedidos com filtros:", req.query);
    const { produto, fornecedor, data } = req.query;
    
    let sql = `
      SELECT 
        ped.id, 
        prod.nome AS produto_nome, 
        forn.nome AS fornecedor_nome, 
        ped.quantidade, 
        ped.data 
      FROM pedidos AS ped
      LEFT JOIN produtos AS prod ON ped.id_produto = prod.codigo
      LEFT JOIN fornecedores AS forn ON ped.id_fornecedor = forn.id
      WHERE 1=1
    `;
    const params = [];

    if (produto) { sql += ' AND prod.codigo = ?'; params.push(produto); }
    if (fornecedor) { sql += ' AND forn.id = ?'; params.push(fornecedor); }
    if (data) { sql += ' AND ped.data = ?'; params.push(data); }

    const [pedidos] = await pool.query(sql, params);
    res.json(pedidos);
  } catch (err) {
    console.error("Erro em GET /pedidos:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/pedidos', async (req, res) => {
    try {
        const { id_produto, id_fornecedor, quantidade, data } = req.body;
        console.log("Recebida requisição POST para /pedidos com dados:", req.body);
        const sql = 'INSERT INTO pedidos (data, id_produto, quantidade, id_fornecedor) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [data, id_produto, quantidade, id_fornecedor]);
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error("Erro em POST /pedidos:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});