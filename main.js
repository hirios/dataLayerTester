    function addBlueBorder(event) {
        // Ignorar se o elemento está dentro de #janelaPrincipal
        if (document.querySelector("#janelaPrincipal").contains(event.target)) {
            return;
        }
        // Força a borda azul em todos os lados
        event.target.style.border = '4px solid blue';
    }

    // Função para remover a borda
    function removeBlueBorder(event) {
        // Ignorar se o elemento está dentro de #janelaPrincipal
        if (document.querySelector("#janelaPrincipal").contains(event.target)) {
            return;
        }
        // Remove qualquer borda
        event.target.style.border = '';
    }

    // Função para gerar o caminho completo do elemento no DOM antes do clique
    function printCssSelector(event) {
        // Ignorar se o elemento está dentro de #janelaPrincipal
        if (document.querySelector("#janelaPrincipal").contains(event.target)) {
            return;
        }

        const element = event.target;

        // Gera o caminho completo do elemento e o índice
        const { path, index } = getElementPathWithIndex(element);

        // Imprime o caminho completo no formato 'document.querySelectorAll("caminho completo")[index]'
        // console.log(`document.querySelectorAll("${path}")[${index}]`);

        const elementSelector = document.querySelector('[id="selector_css_elemento"]');
        const elementIndex = document.querySelector('[id="index_do_elemento"]');
        const elementTag = document.querySelector('[id="tipo_da_tag"]');

        if (elementSelector && elementIndex) {
            elementSelector.value = path;
            elementIndex.value = index;
            elementTag.value = element.tagName;
        }
    }

    function getElementPathWithIndex(element) {
        const path = [];
        let index = -1; // Inicializa o índice como -1 para evitar inconsistências

        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.tagName.toLowerCase(); // Nome da tag

            if (element.id) {
                // Se tiver ID, use-o diretamente
                selector += `#${element.id}`;
                path.unshift(selector);
                break; // IDs são únicos, podemos parar aqui
            } else {
                // Processar classes do elemento
                const className = Array.from(element.classList)
                    .filter(cls => cls.trim() !== "") // Remove classes vazias ou inválidas
                    .join('.');

                if (className) {
                    selector += `.${className}`;
                }

                path.unshift(selector);
            }

            // Subir para o elemento pai
            element = element.parentElement;
        }

        // Agora calcular o índice do link clicado entre todos os links no DOM
        const allElementsWithSameSelector = Array.from(document.querySelectorAll(path.join(' > ')));  // Seleciona todos os elementos com o mesmo seletor
        index = allElementsWithSameSelector.indexOf(event.target); // Encontra o índice correto do elemento clicado

        return { path: path.join(' > '), index };
    }

    // Função para adicionar os eventos de mouse
    function addHoverEffect() {
        // Seleciona todos os elementos da página
        const elements = document.querySelectorAll('*');

        // Itera sobre os elementos respeitando a ordem de ocorrência no DOM
        elements.forEach(element => {
            // Adiciona o evento de mouseover para adicionar a borda
            element.addEventListener('mouseover', addBlueBorder);

            // Adiciona o evento de mouseout para remover a borda
            element.addEventListener('mouseout', removeBlueBorder);

            // Adiciona o evento de click para capturar o seletor antes das mudanças no DOM
            element.addEventListener('mousedown', printCssSelector);
        });

    }

    // Função para remover o efeito hover
    function removeHoverEffect() {
        // Seleciona todos os elementos da página
        const elements = document.querySelectorAll('*');

        // Itera sobre os elementos e remove os eventos de hover
        elements.forEach(element => {
            element.removeEventListener('mouseover', addBlueBorder);
            element.removeEventListener('mouseout', removeBlueBorder);
            element.removeEventListener('mousedown', printCssSelector);
        });
    }


    // 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000


    function htmlStart() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <div id="janelaPrincipal">
    <div id="janelaPrincipal">
    <button class="close-button" onclick="htmlStart(); closeEditEtapa();" style="position: relative; top: 5px; left: 280px;">✖</button>
    <div class="div-inputs-superiores">
    <input class="input-superior" id="nome_para_gravacao" placeholder="Nome para gravação" style="height: 47px;">
    </div>
    <button class="botao-prosseguir" onclick="objetoDLTESTERDATA();" style="
    height: 47px;
    ">
    Prosseguir gravação
    </button>

    <div style="position: inherit; display: flex; bottom: 0px;padding: 10px 16.2px;">

    <div id="container-lista-de-gravacoes" style="bottom: 100px;position: inherit;width: 280px;display: flex;flex-direction: column;height: 250px;">
    <div style="align-items: center;display: flex;flex-direction: column;background-color: #b383a5;height: 50;justify-content: center;color: white;">Lista de gravações </div>
    <div id="lista-de-gravacoes">
    </div>
    </div>
    </div>
    </div>
    </div>
    `
        obterGravacoes();
    }

    function htmlGravacoes() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <div id="janelaPrincipal">
    <button class="close-button" onclick="htmlStart(); closeEditEtapa();" style="top: 5px;position: relative;left: 280px;">✖</button>
    <div class="div-botoes-superiores">
        <button id="interagir-com-elemento" onclick="htmlInteracoes()" class="botao-superior">INTERAGIR COM ELEMENTO</button>
        <button id="ir-para-pagina" onclick="htmlNavegacao()" class="botao-superior">IR PARA PÁGINA</button>
        <button id="verificar-datalayer" class="botao-superior">VERIFICAR DATALAYER</button>
    </div>
    <!-- Novo botão posicionado exatamente acima do container de tarefas -->
    <button id="validaEtapas">Testar etapas</button>
    <div id="container-tarefas">
        <div id="div-tarefas">                
        </div>
    </div>
    </div>
    `

        removeHoverEffect();
        obterEtapas();

    }

    function htmlInteracoes() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <div id="janelaPrincipal">
    <button class="close-button" onclick="htmlGravacoes(); closeEditEtapa();" style="top: 5px;position: relative;left: 280px;">✖</button>
    <div class="div-inputs-superiores">
    <input class="input-superior" id="selector_css_elemento" style="height: 47px;" placeholder="Seletor do elemento">
    <div class="sub-input">
        <input class="input-superior" id="tipo_da_tag" placeholder="Tag" disabled="" style="width: 125px; height: 47px;">
        <input class="input-superior" id="index_do_elemento" placeholder="Index" style="width: 125px; height: 47px;">
    </div>
    <input class="input-superior" id="preencher_input" style="height: 47px;" placeholder="Preencher Input (opcional)">
    <input class="input-superior" id="delay_ms" style="height: 47px;" placeholder="Delay ms">
    </div>
    <button id="add-interacao" onClick="criarEtapaInteracao()" class="botao-add-etapa">Gravar etapa</button>

    </div>
    `

        addHoverEffect();
    }

    function htmlNavegacao() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <div id="janelaPrincipal">
    <button class="close-button" onclick="htmlGravacoes(); closeEditEtapa();" style="top: 5px;position: relative;left: 280px;">✖</button>
    <div class="div-inputs-superiores">
    <input class="input-superior" placeholder="URL da página">
    <input class="input-superior" placeholder="Delay ms">
    </div>
    <!-- Novo botÃĢo posicionado exatamente acima do container de tarefas -->
    <button id="add-navegacao" class="botao-add-etapa">Gravar etapa</button>
    </div>
    `
    }

    function obterGravacaoById(id_gravacao) {
        const data = JSON.parse(localStorage.getItem('DLTESTERDATA'));

        if (data) {
            for (let gravacao of data) {
                if (gravacao['url_page'] === window.location.host) {
                    if (gravacao['id_gravacao'] === id_gravacao) {
                        return gravacao;
                    }
                }
            }
        }

        return null; // Retorna null se não encontrar nenhuma gravação correspondente
    }


    function objetoDLTESTERDATA(botaoGravacao = null) {
        if (botaoGravacao && botaoGravacao.value) {
            window.DLTESTERDATA = obterGravacaoById(botaoGravacao.value);
            htmlGravacoes();
            return;
        }

        window.DLTESTERDATA = {};
        window.DLTESTERDATA['url_page'] = window.location.host;
        window.DLTESTERDATA['status_gravacao'] = 'em_criacao';

        const nomeParaGravacao = document.querySelector('[id="nome_para_gravacao"]').value;
        if (nomeParaGravacao.length > 0) {
            window.DLTESTERDATA['id_gravacao'] = nomeParaGravacao
            htmlGravacoes();
        }
    }

    function obterGravacoes() {
        const data = JSON.parse(localStorage.getItem('DLTESTERDATA'));

        if (data) {
            data.forEach(function (gravacao) {
                if (gravacao['url_page'] == window.location.host) {

                    const container = document.getElementById('lista-de-gravacoes');
                    const button = document.createElement('button');
                    button.className = 'gravacao';
                    button.value = gravacao['id_gravacao'];
                    button.textContent = gravacao['id_gravacao'];
                    button.addEventListener('click', function () {
                        objetoDLTESTERDATA(this);
                    });
                    container.appendChild(button);
                }
            });
        }
    }


    function obterEtapas() {
        if (DLTESTERDATA['status_gravacao'] == "em_criacao") {
            return;
        } 

        const data = JSON.parse(localStorage.getItem('DLTESTERDATA'));

        if (data) {
            data.forEach(function (gravacao) {
                if (gravacao['url_page'] == window.location.host) {
                    if (gravacao['id_gravacao'] == DLTESTERDATA['id_gravacao']) {
                        for (let etapa of gravacao['etapas']) {
                            const container = document.getElementById('div-tarefas');
                            const button = document.createElement('button');
                            button.className = 'tarefas';
                            button.textContent = etapa['etapa'];
                            button.value = etapa['etapa'];
                            button.addEventListener('click', function () {
                                editarEtapa(this);
                            });
                            container.appendChild(button);
                        }
                    }

                }
            });
        }
    }


    function getNumEtapa() {
        if (Object.keys(DLTESTERDATA).includes('etapas')) {
            return DLTESTERDATA['etapas'].length + 1;
        } else {
            return 1;
        }
    }


    function salvarEtapas() {
        const data = JSON.parse(localStorage.getItem('DLTESTERDATA'));

        // Caso a estrututura dataLayerTester ja exista no localStorage
        let stop = true;
        let data_length = data ? data.length : undefined;

        if (data) {
            for (let index_gravacao = 0; index_gravacao < data_length; index_gravacao++) {
                if (data[index_gravacao]['url_page'] == window.location.host) {

                    // Caso exista a estrtutura, procura o id_da gravação
                    if (data[index_gravacao]['id_gravacao'] == DLTESTERDATA['id_gravacao']) {
                        stop = false;
                        data[index_gravacao] = DLTESTERDATA;
                        localStorage['DLTESTERDATA'] = JSON.stringify(data);
                    } 
                }
            }

            if (stop) {
                // Se ainda não existir esse id, é uma gravação nova e não uma atualização
                data.push(DLTESTERDATA);
                localStorage['DLTESTERDATA'] = JSON.stringify(data);
            }
           
            // Se não tiver, popula o localStorage com o dataLayerTester
        } else {
            localStorage['DLTESTERDATA'] = JSON.stringify([DLTESTERDATA]);
        }
    }


    function criarEtapaInteracao() {
        const elementSelector = document.querySelector('[id="selector_css_elemento"]');
        const elementIndex = document.querySelector('[id="index_do_elemento"]');
        const elementPreencherInput = document.querySelector('[id="preencher_input"]');
        const elementDelay = document.querySelector('[id="delay_ms"]');
        
        if (elementSelector.value && elementIndex.value && elementDelay.value) {
            DLTESTERDATA['etapa_atual'] = 0;
            DLTESTERDATA['status_gravacao'] = 'em_disponibilidade';
        
            const data = {
                "etapa": getNumEtapa(),
                "tipo_da_etapa": "interacao",
                "seletor_css": elementSelector.value,
                "index_do_elemento": +elementIndex.value,
                "inputValue": elementPreencherInput.value,
                "delay": +elementDelay.value,   
            }

            if (typeof DLTESTER_EDIT != 'undefined') {
                data['etapa'] = DLTESTER_EDIT + 1;
                DLTESTERDATA['etapas'][DLTESTER_EDIT] = data;
                window.DLTESTER_EDIT = undefined;
                
                salvarEtapas();
                alert('Etapa gravada com sucesso')
                
                return;
            }
        
            if (Object.keys(DLTESTERDATA).includes('etapas')) {
                DLTESTERDATA['etapas'].push(data);
                salvarEtapas();
                alert('Etapa gravada com sucesso')
            } else {
                DLTESTERDATA['etapas'] = [data];
                salvarEtapas();
                alert('Etapa gravada com sucesso')
            }
        }
    }


    function closeEditEtapa() {
        window.DLTESTER_EDIT = undefined;
    }
    

    function editarEtapa(element) {
        window.DLTESTER_EDIT = element.value - 1;
        const objetoEtapa = DLTESTERDATA['etapas'][DLTESTER_EDIT];
        
        if (objetoEtapa['tipo_da_etapa'] == 'interacao') {
            htmlInteracoes();
    
            const elementSelector = document.querySelector('[id="selector_css_elemento"]');
            const elementIndex = document.querySelector('[id="index_do_elemento"]');
            const elementPreencherInput = document.querySelector('[id="preencher_input"]');
            const elementDelay = document.querySelector('[id="delay_ms"]');
    
            elementSelector.value = objetoEtapa['seletor_css'];
            elementIndex.value = objetoEtapa['index_do_elemento'];
            elementPreencherInput.value = objetoEtapa['inputValue'];
            elementDelay.value = objetoEtapa['delay'];
        }
        
        if (objetoEtapa['tipo_da_etapa'] == 'navegacao') {
            htmlNavegacao();
        }
    
        if (objetoEtapa['tipo_da_etapa'] == 'datalayer') {
    
        }
    }



    (function() {
        // Criação do HTML da interface
        const interfaceHTML = `
        <html>
        <head>
            <style>
        
            </style>
            <script>
        
            </script>
        </head>
        
        <body>
            <div id="janelaPrincipal">
                <div id="janelaPrincipal">
                </div>
                <script>
                    htmlStart();
                </script>
        </body>
        </html>
        `;

        // Injetando o HTML no corpo da página
        document.body.insertAdjacentHTML('beforeend', interfaceHTML);

        // Estilos CSS a serem injetados
        const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');

        body,
        input,
        .botao-superior,
        .tarefas,
        .botao-add-etapa,
        .botao-prosseguir,
        #botao-add-gravacao,
        #container-lista-de-gravacoes,
        .gravacao {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
        }

        .botao-superior,
        .tarefas {
            font-size: 14px;
        }

        #janelaPrincipal {
            position: fixed;
            width: 320px;
            height: 542px;
            background-color: rgb(73, 88, 128);
            box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;
            z-index: 1000;
            border-radius: 10px;
            border: 4px solid;
            bottom: 70px;
            right: 20px;
        }

        .div-botoes-superiores,
        .div-inputs-superiores {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 25px;
        }

        .botao-superior,
        .input-superior {
            background-color: rgb(217, 217, 217);
            color: black;
            border: 3px solid;
            border-radius: 10px;
            padding: 10px 10px;
        }

        #container-tarefas {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgb(217, 217, 217);
            height: 200px;
            width: 260px;
            color: black;
            border: 3px solid;
            border-radius: 15px;
            overflow-y: auto;
        }

        #div-tarefas {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
            justify-content: space-between;
            align-content: center;
        }

        .tarefas {
            background-color: rgb(104, 195, 202);
            color: black;
            border-radius: 10px;
            width: 40px;
            height: 40px;
            border: 3px solid;
        }

        #botao-add-gravacao {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background-color: #e1b8d9;
            color: black;
            border: 3px solid;
            border-radius: 10px;
            width: 260px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .botao-add-etapa, .botao-prosseguir {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background-color: #A4FF7A;
            color: black;
            border: 3px solid;
            border-radius: 10px;
            width: 260px;
            height: 46px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .sub-input {
            display: flex;
            justify-content: space-between;
        }

        input {
            font-size: 14px;
            color: #000000;
            font-weight: 700;
            text-align: center;
        }

        input::placeholder {
            color: #000000;
            font-size: 14px;
            text-align: center;
        }


        /* Botão posicionado exatamente acima do container-tarefas */
        #validaEtapas {
            position: absolute;
            bottom: 250px;
            /* Ajuste a distância conforme necessário */
            left: 50%;
            transform: translateX(-50%);
            background-color: rgb(241 225 56);
            color: rgb(0, 0, 0);
            border: none;
            border-radius: 10px;
            height: 46px;
            width: 260px;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;

            display: flex;
            justify-content: center;
            align-items: center;

            border-style: solid;
            border-width: 3px;
        }

        .gravacao {
            background-color: white;
            border-radius: 10px;
            padding: 10px;
        }

        #lista-de-gravacoes {
            display: flex;
            flex-wrap: nowrap;
            flex-direction: column;
            padding: 10px 10px;
            gap: 10px;
            background-color: #ffeef7;
            overflow-y: auto;
            height: 100%;
        }

        button {
            cursor: pointer;
        }
        `;

        // Criando um elemento de estilo e injetando na página
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
    })();


htmlStart();


// Função para garantir que os inputs não sejam bloqueados pelo modal
function ensureInputAccessibility() {
    const janelaPrincipal = document.getElementById('janelaPrincipal');
    if (!janelaPrincipal) return;

    // Garantir que a interface fique sempre no topo
    janelaPrincipal.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
    janelaPrincipal.style.pointerEvents = 'auto'; // Permite interação com a interface

    // Desabilitar a interação com o modal (impede que sobreponha os inputs)
    const modals = document.querySelectorAll('.modal, .modal-backdrop');
    modals.forEach((modal) => {
        modal.style.pointerEvents = 'none'; // Impede a interação com o modal
    });

    // Garantir que os inputs possam ser focados
    const inputs = janelaPrincipal.querySelectorAll('input');
    inputs.forEach((input) => {
        input.style.pointerEvents = 'auto'; // Permite que os inputs sejam interativos
    });
}

// Chama a função para garantir a acessibilidade dos inputs
ensureInputAccessibility();



// (function () {
//     // Garantir que a janela principal (interface) fique sempre no topo
//     function ensureOnTop() {
//         const janelaPrincipal = document.getElementById('janelaPrincipal');
//         if (janelaPrincipal) {
//             // Colocar o maior z-index possível para a janela principal
//             janelaPrincipal.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
//             janelaPrincipal.style.pointerEvents = 'auto'; // Permite interação com a interface
//         }
//     }

//     // Impedir que overlays (backdrop) e modais interfiram na interação com a interface
//     function disableModalInteraction() {
//         const modals = document.querySelectorAll('.modal, .modal-backdrop');
//         modals.forEach((modal) => {
//             // Desativa qualquer interação com o backdrop e o modal
//             modal.style.pointerEvents = 'none'; // Evita que o modal capture eventos
//         });
//     }

//     // Garantir que os modais fiquem abaixo da janela principal (ajustando z-index)
//     function ensureModalBelowInterface() {
//         const modals = document.querySelectorAll('.modal, .modal-backdrop');
//         modals.forEach((modal) => {
//             // Definir z-index do modal e backdrop para ser menor que o da janelaPrincipal
//             modal.style.zIndex = '9999'; // Um valor abaixo do da janelaPrincipal
//         });
//     }

//     // Prevenir que eventos de interação (como cliques) no modal bloqueiem a interface
//     function preventEventBlocking() {
//         const janelaPrincipal = document.getElementById('janelaPrincipal');
//         if (!janelaPrincipal) return;

//         // Impede que cliques e outros eventos dentro da janelaPrincipal sejam capturados por modais ou overlays
//         janelaPrincipal.addEventListener('mousedown', (e) => e.stopPropagation(), true);
//         janelaPrincipal.addEventListener('click', (e) => e.stopPropagation(), true);
//         janelaPrincipal.addEventListener('focus', (e) => e.stopPropagation(), true);
//     }

//     // Função para garantir que a interface e o modal não bloqueiem um ao outro
//     function updateInterfaceAndModal() {
//         ensureOnTop();               // Coloca a interface no topo
//         disableModalInteraction();   // Desativa interação com modais
//         ensureModalBelowInterface(); // Coloca o modal abaixo da interface
//     }

//     // Monitorar alterações no DOM para quando novos modais forem inseridos
//     const observer = new MutationObserver(() => {
//         updateInterfaceAndModal(); // Atualiza z-index e interação quando o DOM mudar
//     });

//     // Iniciar o observador no corpo do documento
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//     });

//     // Aplicar ajustes iniciais na interface e modais
//     updateInterfaceAndModal();
// })();

