// ==============================
// CONFIGURAÇÕES E ESTADO GLOBAL
// ==============================

const pijamasPadrao = [
    { id: 1, nome: "Baby Alça Hello kitty", preco: 53.00, categoria: "feminino", img: "baby alça (2).jpeg" },
    { id: 2, nome: "Camisola Mia", preco: 58.00, categoria: "feminino", img: "WhatsApp Image 2026-07-15 at 12.56.06.jpeg" },
    { id: 3, nome: "Baby Sonho M. Super Poderosas", preco: 64.00, categoria: "infantil", img: "baby alça.jpeg" },
    { id: 4, nome: "Americano Snoopy", preco: 100.00, categoria: "infantil", img: "babysonho.jpeg.jpeg" }
];

let produtos = [];

// Inicialização dos dados a partir do localStorage
try {
    const dadosLocais = localStorage.getItem('produtos_catalogo');
    if (!dadosLocais || dadosLocais === "undefined" || dadosLocais === "null" || dadosLocais === "[]") {
        localStorage.setItem('produtos_catalogo', JSON.stringify(pijamasPadrao));
        produtos = pijamasPadrao;
    } else {
        produtos = JSON.parse(dadosLocais);
    }
} catch (e) {
    produtos = pijamasPadrao;
}

// ==============================
// FUNÇÕES UTILITÁRIAS
// ==============================

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==============================
// RENDERIZAÇÃO DA TABELA
// ==============================

function atualizarTabelaAdmin() {
    const tbody = document.getElementById('tabela-produtos');
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    if (produtos.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 30px; opacity: 0.5;'>Nenhum pijama cadastrado.</td></tr>";
    } else {
        produtos.forEach((prod, index) => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${escapeHTML(prod.img)}" class="img-tabela" alt="Produto" onerror="this.src='https://via.placeholder.com/50'"></td>
                    <td><b>${escapeHTML(prod.nome)}</b></td>
                    <td><span class="tag-categoria ${escapeHTML(prod.categoria)}">${escapeHTML(prod.categoria)}</span></td>
                    <td>R$ ${Number(prod.preco).toFixed(2).replace('.', ',')}</td>
                    <td class="acoes">
                        <button class="btn-acao excluir" onclick="excluirProduto(${index})">⚠️ Excluir</button>
                    </td>
                </tr>
            `;
        });
    }

    // Atualiza os contadores com segurança
    const totalQtd = document.getElementById('qtd-total');
    const femQtd = document.getElementById('qtd-fem');
    const infQtd = document.getElementById('qtd-inf');

    if (totalQtd) totalQtd.innerText = produtos.length;
    if (femQtd) femQtd.innerText = produtos.filter(p => p.categoria === 'feminino').length;
    if (infQtd) infQtd.innerText = produtos.filter(p => p.categoria === 'infantil').length;
}

// ==============================
// AÇÕES DO FORMULÁRIO (CADASTRO)
// ==============================

const formProduto = document.getElementById('form-produto');
if (formProduto) {
    formProduto.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const nomeInput = document.getElementById('prod-nome');
        const precoInput = document.getElementById('prod-preco');
        const categoriaInput = document.getElementById('prod-categoria');
        const imgInput = document.getElementById('prod-img');

        if (!nomeInput || !precoInput || !categoriaInput || !imgInput) return;

        const nome = nomeInput.value.trim();
        const preco = parseFloat(precoInput.value);
        const categoria = categoriaInput.value;
        const img = imgInput.value.trim();

        // Validação adicional de segurança e valores corretos
        if (!nome || isNaN(preco) || preco < 0 || !img) {
            alert("Por favor, preencha todos os campos corretamente. O preço deve ser maior ou igual a zero.");
            return;
        }

        const novo = {
            id: Date.now(), 
            nome: nome,
            preco: preco,
            categoria: categoria,
            img: img
        };

        produtos.push(novo);
        localStorage.setItem('produtos_catalogo', JSON.stringify(produtos));
        
        atualizarTabelaAdmin();
        this.reset();
        alert("Pijama cadastrado com sucesso!");
    });
}

// ==============================
// EXCLUSÃO DE PRODUTOS
// ==============================

function excluirProduto(posicao) {
    if (posicao < 0 || posicao >= produtos.length) return;
    const pijamaNome = produtos[posicao].nome;
    if (confirm(`Tem certeza de que deseja excluir o pijama "${pijamaNome}"?`)) {
        produtos.splice(posicao, 1);
        localStorage.setItem('produtos_catalogo', JSON.stringify(produtos));
        atualizarTabelaAdmin();
        alert("Produto removido com sucesso!");
    }
}

// Inicialização da página
window.onload = atualizarTabelaAdmin;