function scrollElement(selector, direction) {
    document.querySelector(selector).scrollBy({
        left: direction === 'left' ? -400 : 400, // Esquerda ou direita
        behavior: 'smooth'
    });
}

const timeline = document.querySelector('.timeline')

timeline.style.left = '0'

function abrirModal() {
    const modal = document.getElementById('janela-modal')
    modal.classList.add('abrir')
}

let personagensData = []
let sagasData = []


async function carregarGaleria(tipo = 'mugiwara') {
    try {
        const response = await fetch('js/personagens.json')
        personagensData = await response.json()

        const galeria = document.querySelector('.galeria')
        galeria.innerHTML = ''

        const personagensFiltrados = personagensData.filter(personagem => {
            return personagem.tipo.includes(tipo)
        })

        personagensFiltrados.forEach(personagem => {
            const singleGaleria = document.createElement('div')
            singleGaleria.classList.add('single-galeria')

            singleGaleria.innerHTML = `
                <img src="${personagem.imagens[0]}" alt="${personagem.nomePrincipal}">
                <div class="info">
                    <button onclick="abrirModal('${personagem.nomePrincipal}')" class="btn-modal"><ion-icon name="open-outline"></ion-icon></button>
                    <h1>${personagem.nomePrincipal}</h1>
                    <p>${personagem.descricoes[0]}</p>
                    <span>${personagem.recompensa}</span>
                </div>
            `

            galeria.appendChild(singleGaleria)
        })
    } catch (erro) {
        console.error('Erro ao carregar o JSON:', erro)
    }
}

function abrirModal(nomePersonagem) {
    const personagem = personagensData.find(p => p.nomePrincipal === nomePersonagem)

    if (personagem) {
        fecharModal()

        const modalContainer = document.createElement('div')
        modalContainer.classList.add('janela-modal')
        modalContainer.classList.add('abrir')

        modalContainer.innerHTML = `
        <div class="modal" >
            <div class="branco-modal">
                <button class="fechar-modal" onclick="fecharModal()">
                    <ion-icon name="close-circle-outline"></ion-icon>
                </button>
                <div class="content-modal">
                    <div class="info-modal">
                        <h2>Akuma no mi:</h2>
                        <p>${personagem.akuma}</p><br>
                        <h2>Origem:</h2>
                        <p>${personagem.origem}</p><br>
                        <h2>Altura:</h2>
                        <p>${personagem.altura}</p><br>
                        <h2>Idade:</h2>
                        <p>${personagem.idade}</p>
                    </div>
                    <div class="img-modal">
                        <img src="${personagem.imagens[1]}" alt="Jolly Roger">
                    </div>
                    <div class="modal-text">
                        <img src="${personagem.jolly_roger}" alt="${personagem.nome}">
                        <h2>${personagem.nome}</h2>
                        <h1>${personagem.nomePrincipal}</h1>
                        <p>${personagem.descricoes[1]}</p>
                        <div class="recompensa">
                            <img src="assets/imgs/pngegg (4) (1).png" alt="Recompensa">
                            <span>${personagem.recompensa}</span>
                        </div>
                        <h2>Status: <span>${personagem.status}</span></h2>
                    </div>
                </div>
            </div>
        </div>
        `

        document.body.appendChild(modalContainer)
    } else {
        console.error('Personagem não encontrado:', nomePersonagem)
    }
}

function listenerPersonagem(nomePersonagem) {
    document.getElementById(nomePersonagem).addEventListener('click', () => {
        abrirModal(nomePersonagem);
    });
}

async function carregarTimeline() {
    try {
        const response = await fetch('js/sagas.json')
        sagasData = await response.json()

        const timeline = document.querySelector('.timeline')

        sagasData.eventos.forEach(saga => {
            const li = document.createElement('li')
            li.setAttribute('data-date', saga.titulo)

            li.innerHTML = `
        <div class="data" onclick="abrirInfo(this)">
            <div class="title-sagas">
            <h3>${saga.detalhes.tipo}</h3>
            <h2>${saga.titulo}</h2> 
        </div>
        <div class="content-sagas">
            <div class="arcos">
                <h3>Arcos:</h3>
                <ul>
                    ${saga.detalhes.arcos.map(arco =>
                `<li onclick="mudarConteudo('${arco.titulo}', '${arco.descricao}', '${arco.imagem}', 'ARCO', '${arco.capitulos}')">${arco.titulo}</li>`
            ).join('')}
                </ul>
                <button class="voltar-saga" onclick="mudarConteudo('${saga.titulo}', '${saga.detalhes.descricao}', '${saga.detalhes.imagem}', '${saga.detalhes.tipo}', '${saga.detalhes.capitulos}')">saga</button>
            </div>

            <span>
                <p>${saga.detalhes.descricao}</p>
                <h4>${saga.detalhes.capitulos}</h4>
            </span>
        </div>
    </div>
`

            const dataShow = li.querySelector('.data');
            dataShow.style.backgroundImage = `
    linear-gradient(to right, black 30%, transparent 100%),
    linear-gradient(rgba(0, 0, 0, 0.377), rgba(0, 0, 0, 0.467)),
    url('${saga.detalhes.imagem}')
`;


            const ultimoItemFixado = document.querySelector('.timeline li.fixed:last-of-type')
            timeline.insertBefore(li, ultimoItemFixado)
        })
    } catch (erro) {
        console.error('Erro ao carregar o JSON da timeline:', erro)
    }
}

function mudarConteudo(titulo, descricao, imagem, tipo = 'ARCO', capitulos) {
    const dataShow = document.querySelector('.data.show');

    const tituloSaga = dataShow.querySelector('.title-sagas h2');
    tituloSaga.innerHTML = titulo;

    const descricaoSpan = dataShow.querySelector('span');
    const descricaoTexto = descricaoSpan.querySelector('p');
    descricaoTexto.innerHTML = descricao;

    const tipoElement = dataShow.querySelector('.title-sagas h3');
    tipoElement.innerHTML = tipo;

    const capitulosP = descricaoSpan.querySelector('h4');
    capitulosP.innerHTML = capitulos ? capitulos : '';

    if (dataShow) {
        dataShow.style.backgroundImage = `
            linear-gradient(to right, black 30%, transparent 100%),
            linear-gradient(rgba(0, 0, 0, 0.713), rgba(0, 0, 0, 0.655)),
            url('${imagem}')
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarGaleria()
    carregarTimeline()
})

function abrirInfo(elemento) {
    elemento.classList.add('show')
}

document.addEventListener('click', function (event) {
    const dataElement = document.querySelector('.data.show')
    if (dataElement && !dataElement.contains(event.target)) {
        dataElement.classList.remove('show')
    }
})

function fecharModal() {
    const modal = document.querySelector('.janela-modal')
    if (modal) {
        modal.remove()
    }
}

function atualizarBotoesAtivos(botaoAtivo) {
    document.querySelectorAll('.tipo-personagem button').forEach(button => {
        button.classList.remove('active')
    })
    botaoAtivo.classList.add('active')
}

const btnMugiwara = document.getElementById('btn-mugiwaras')
btnMugiwara.addEventListener('click', () => {
    carregarGaleria('mugiwara')
    atualizarBotoesAtivos(btnMugiwara)
})

const btnImperador = document.getElementById('btn-imperadores')
btnImperador.addEventListener('click', () => {
    carregarGaleria('imperador')
    atualizarBotoesAtivos(btnImperador)
})

const btnMarinha = document.getElementById('btn-marinha')
btnMarinha.addEventListener('click', () => {
    carregarGaleria('marinheiro')
    atualizarBotoesAtivos(btnMarinha)
})

document.getElementById('link-marinha').addEventListener('click', () => {
    btnMarinha.click()
    descerSecao('personagens')
});

document.getElementById('link-imperadores').addEventListener('click', () => {
    btnImperador.click()
    descerSecao('personagens')
});

document.getElementById('link-mugiwaras').addEventListener('click', () => {
    btnMugiwara.click()
    descerSecao('personagens')
})

function descerSecao(id) {
    const secaoPersonagens = document.getElementById(id)
    secaoPersonagens.scrollIntoView({ behavior: 'smooth' })
}

const personagensParagrafo = ['Roger', 'Luffy', ];

personagensParagrafo.forEach(personagem => {
    listenerPersonagem(personagem);
});

