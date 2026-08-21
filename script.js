// ============================================================
// CARRINHO
// ============================================================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ============================================================
// SALVAR CARRINHO
// ============================================================

function salvarCarrinho() {

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

}


// ============================================================
// CONTADOR DO CARRINHO
// ============================================================

function atualizarContadorCarrinho() {

    const contador = document.getElementById("contador-carrinho");

    if (!contador) {
        return;
    }

    let quantidadeTotal = 0;

    carrinho.forEach(function(item) {

        quantidadeTotal += item.quantidade;

    });

    contador.textContent = quantidadeTotal;

}


// ============================================================
// CONVERTER PREÇO
// ============================================================

function converterPreco(precoTexto) {

    return Number(
        precoTexto
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

}


// ============================================================
// FORMATAR PREÇO
// ============================================================

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


// ============================================================
// PÁGINA DE PRODUTOS
// ============================================================

const produtos = document.querySelectorAll(".produto");


produtos.forEach(function(produto) {

    const botoes =
        produto.querySelectorAll(".quantidade button");

    const botaoMenos = botoes[0];

    const botaoMais = botoes[1];

    const quantidadeElemento =
        produto.querySelector(".quantidade span");

    const botaoPresentear =
        produto.querySelector(".presentear");


    // --------------------------------------------------------
    // BOTÃO -
    // --------------------------------------------------------

    botaoMenos.addEventListener("click", function() {

        let quantidade =
            Number(quantidadeElemento.textContent);

        if (quantidade > 1) {

            quantidade--;

            quantidadeElemento.textContent = quantidade;

        }

    });


    // --------------------------------------------------------
    // BOTÃO +
    // --------------------------------------------------------

    botaoMais.addEventListener("click", function() {

        let quantidade =
            Number(quantidadeElemento.textContent);

        quantidade++;

        quantidadeElemento.textContent = quantidade;

    });


    // --------------------------------------------------------
    // BOTÃO PRESENTEAR
    // --------------------------------------------------------

    botaoPresentear.addEventListener("click", function() {

        const nome =
            produto.querySelector("h3").textContent.trim();

        const preco =
            converterPreco(
                produto.querySelector(".preco").textContent
            );

        const quantidade =
            Number(quantidadeElemento.textContent);


        const itemExistente =
            carrinho.find(function(item) {

                return item.nome === nome;

            });


        if (itemExistente) {

            itemExistente.quantidade += quantidade;

        } else {

            carrinho.push({

                nome: nome,

                preco: preco,

                quantidade: quantidade

            });

        }


        salvarCarrinho();

        atualizarContadorCarrinho();


        quantidadeElemento.textContent = "1";


        botaoPresentear.textContent = "ADICIONADO!";


        setTimeout(function() {

            botaoPresentear.textContent = "PRESENTEAR";

        }, 1000);

    });

});


// ============================================================
// PÁGINA DO CARRINHO
// ============================================================

const listaCarrinho =
    document.getElementById("lista-carrinho");


if (listaCarrinho) {

    mostrarCarrinho();

}


// ============================================================
// MOSTRAR CARRINHO
// ============================================================

function mostrarCarrinho() {

    // Recupera os dados novamente

    carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    listaCarrinho.innerHTML = "";


    // --------------------------------------------------------
    // CARRINHO VAZIO
    // --------------------------------------------------------

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        document.getElementById("valor-total").textContent =
            "R$ 0,00";

        atualizarContadorCarrinho();

        return;

    }


    let total = 0;


    // --------------------------------------------------------
    // CRIAR CADA ITEM
    // --------------------------------------------------------

    carrinho.forEach(function(item, index) {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;


        const elemento =
            document.createElement("div");


        elemento.classList.add("item-carrinho");


        elemento.innerHTML = `

            <div class="informacoes-item">

                <h3>${item.nome}</h3>

                <p>
                    ${formatarPreco(item.preco)} cada
                </p>

            </div>


            <div class="controle-carrinho">

                <button
                    type="button"
                    class="diminuir-carrinho">
                    −
                </button>


                <span>
                    ${item.quantidade}
                </span>


                <button
                    type="button"
                    class="aumentar-carrinho">
                    +
                </button>

            </div>


            <div class="subtotal">

                ${formatarPreco(subtotal)}

            </div>

        `;


        // ----------------------------------------------------
        // BOTÃO -
        // ----------------------------------------------------

        const botaoMenos =
            elemento.querySelector(".diminuir-carrinho");


        botaoMenos.addEventListener("click", function() {

            item.quantidade--;


            // Se chegar a zero,
            // remove completamente o presente.

            if (item.quantidade <= 0) {

                carrinho.splice(index, 1);

            }


            salvarCarrinho();

            mostrarCarrinho();

        });


        // ----------------------------------------------------
        // BOTÃO +
        // ----------------------------------------------------

        const botaoMais =
            elemento.querySelector(".aumentar-carrinho");


        botaoMais.addEventListener("click", function() {

            item.quantidade++;


            salvarCarrinho();

            mostrarCarrinho();

        });


        listaCarrinho.appendChild(elemento);

    });


    // --------------------------------------------------------
    // ATUALIZAR TOTAL
    // --------------------------------------------------------

    document.getElementById("valor-total").textContent =
        formatarPreco(total);


    atualizarContadorCarrinho();

}

// ============================================================
// COPIAR CHAVE PIX
// ============================================================

const botaoCopiarPix = document.querySelector(".copiar-pix");

if (botaoCopiarPix) {

    botaoCopiarPix.addEventListener("click", function() {

        const chavePix =
            document.querySelector(".chave-pix").textContent.trim();

        navigator.clipboard.writeText(chavePix)
            .then(function() {

                botaoCopiarPix.textContent = "COPIADO!";

                setTimeout(function() {

                    botaoCopiarPix.textContent = "COPIAR CHAVE PIX";

                }, 2000);

            })
            .catch(function() {

                alert("Não foi possível copiar a chave Pix.");

            });

    });

}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

atualizarContadorCarrinho();