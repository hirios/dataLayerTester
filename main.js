// ==UserScript==
// @name         DataLayerTester
// @namespace    http://tampermonkey.net/
// @version      2025-01-11
// @description  try to take over the world!
// @author       You
// @match        https://www.omie.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=omie.com.br
// @grant        none
// ==/UserScript==

(function () {
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
  
    function escapeCssSelector(selector) {
        // Lista de caracteres especiais que precisam de escape
        const specialChars = /([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g;
        // Substitui cada caractere especial por uma versão escapada
        return selector.replace(specialChars, '\\$1');
    }
    
    function getElementPathWithIndex(element) {
        const path = [];
        let index = -1; // Inicializa o índice como -1 para evitar inconsistências
    
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.tagName.toLowerCase(); // Nome da tag
    
            if (element.id) {
                // Se tiver ID, use-o diretamente
                selector += `#${escapeCssSelector(element.id)}`; // Escapar o ID
                path.unshift(selector);
                break; // IDs são únicos, podemos parar aqui
            } else {
                // Processar classes do elemento
                const className = Array.from(element.classList)
                    .filter(cls => cls.trim() !== "") // Remove classes vazias ou inválidas
                    .map(cls => escapeCssSelector(cls)) // Escapar as classes
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
  
    function dragAndDrop() {
        const janelaPrincipal = document.getElementById('janelaPrincipal');
        let isDragging = false;
        let offsetX = 0, offsetY = 0;
  
        // Quando o usuário clicar no elemento
        janelaPrincipal.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return; // Não inicia o arraste
            }

            isDragging = true;
            offsetX = e.clientX - janelaPrincipal.offsetLeft;
            offsetY = e.clientY - janelaPrincipal.offsetTop;
            janelaPrincipal.style.zIndex = '1000'; // Coloca o elemento no topo
            ensureInputAccessibility();
        });
  
        // Quando o usuário mover o mouse
        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
  
                janelaPrincipal.style.left = `${x}px`;
                janelaPrincipal.style.top = `${y}px`;
                ensureInputAccessibility();
            }
        });
  
        // Quando o usuário soltar o botão do mouse
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                janelaPrincipal.style.zIndex = ''; // Reseta o z-index
                ensureInputAccessibility();
            }
        });
    }
  
  
    // 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  
  
    function htmlStart() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <button class="close-button" style="position: relative; top: 5px; left: 280px;">✖</button>
    <div class="div-inputs-superiores">
    <input class="input-superior" id="nome_para_gravacao" placeholder="Nome para gravação" style="height: 47px;">
    </div>
    <button class="botao-prosseguir" style="height: 47px;">
    Prosseguir gravação
    </button>
    <button class="testar-gravacoes" style="height: 47px;width: 260px;color: black;border: 3px solid;border-radius: 10px;position: relative;bottom: -60px;und;left: 50%;transform: translateX(-50%);background-color: rgb(241 225 56);top: 75px;">
    Testar todas gravacões
    </button>
  
    <div style="position: absolute;display: flex;bottom: 0px;padding: 10px 16.2px;">
  
    <div id="container-lista-de-gravacoes" style="bottom: 100px;/* position: inherit; */width: 280px;display: flex;flex-direction: column;height: 250px;">
    <div style="align-items: center;display: flex;flex-direction: column;background-color: #b383a5;height: 50;justify-content: center;color: white;">Lista de gravações </div>
    <div id="lista-de-gravacoes">
    </div>
    </div>
    </div>
    `
        obterGravacoes();
    }
  
    function htmlGravacoes() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <button class="close-button" style="top: 5px;position: relative;left: 280px;">✖</button>
    <div class="div-botoes-superiores">
        <button id="interagir-com-elemento" class="botao-superior">INTERAGIR COM ELEMENTO</button>
        <button id="ir-para-pagina" class="botao-superior">IR PARA PÁGINA</button>
        <button id="verificar-datalayer" class="botao-superior">VERIFICAR DATALAYER</button>
    </div>
    <!-- Novo botão posicionado exatamente acima do container de tarefas -->
    <button id="validaEtapas">Testar etapas</button>
    <div id="container-tarefas">
        <div id="div-tarefas">
        </div>
    </div>
    `
  
        removeHoverEffect();
        obterEtapas();
  
    }
  
    function htmlInteracoes() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <button class="close-button" style="top: 5px;position: relative;left: 280px;">✖</button>
    <div class="div-inputs-superiores">
    <input class="input-superior" id="selector_css_elemento" style="height: 47px;" placeholder="Seletor do elemento">
    <div class="sub-input">
        <input class="input-superior" id="tipo_da_tag" placeholder="Tag" disabled="" style="width: 125px; height: 47px;">
        <input class="input-superior" id="index_do_elemento" placeholder="Index" style="width: 125px; height: 47px;">
    </div>
    <input class="input-superior" id="preencher_input" style="height: 47px;" placeholder="Preencher Input (opcional)">
    <input class="input-superior" id="delay_ms" style="height: 47px;" placeholder="Delay ms">
    </div>
    <button id="add-interacao" class="botao-add-etapa">Gravar etapa</button>
    `
  
        addHoverEffect();
    }
  
    function htmlNavegacao() {
        document.querySelector('[id="janelaPrincipal"]').innerHTML = `
    <button class="close-button" style="top: 5px;position: relative;left: 280px;">✖</button>
    <div class="div-inputs-superiores">
    <input class="input-superior" id="url_navegacao" placeholder="URL da página">
    <input class="input-superior" id="delay_ms" placeholder="Delay ms">
    </div>
    <!-- Novo botÃĢo posicionado exatamente acima do container de tarefas -->
    <button id="add-navegacao" class="botao-add-etapa">Gravar etapa</button>
    `
    }


    function htmlDatalayer() {
         document.querySelector('[id="janelaPrincipal"]').innerHTML = `
         <button class="close-button" style="top: 5px;position: relative;left: 280px;">✖</button>
            <div style="gap: 10px;display: flex;flex-direction: column;">
                <div id="list-button-datalayer">
                    <button class="button-from-datalayer">Data</button>
                </div>
                <textarea id="object-to-validation"></textarea>
            </div>
        
        <label class="toggle-switch">
            <input id="add-datalayer" type="radio" onclick="(function(element) { console.log(element) })(this)" style="pointer-events: auto;">
            <span class="slider"></span>
        </label>
        <button id="add-datalayer" class="botao-add-etapa">Gravar etapa</button>`
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
  
                    const div = document.createElement('div');
                    div.className = 'div-container';
                    // div.style.display = 'contents';
  
                    const button = document.createElement('button');
                    button.className = 'gravacao';
                    button.value = gravacao['id_gravacao'];
                    button.textContent = gravacao['id_gravacao'];
                    button.style.width = '100%';
                    button.addEventListener('click', function () {
                        objetoDLTESTERDATA(this);
                    });
  
                    const buttonExcluir = document.createElement('button');
                    buttonExcluir.className = 'excluir-item excluir-gravacao';
                    buttonExcluir.textContent = '-';
                    // buttonExcluir.textContent = 'x';
                    // button.addEventListener('click', function () {
                    //     objetoDLTESTERDATA(this);
                    // });
  
                    div.appendChild(button)
                    div.appendChild(buttonExcluir)
                    container.appendChild(div);
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
                            const div = document.createElement('div');
                            div.className = 'div-container';
  
                            const buttonExcluir = document.createElement('button');
                            buttonExcluir.className = 'excluir-item excluir-etapa';
                            buttonExcluir.textContent = '-';
  
                            const container = document.getElementById('div-tarefas');
                            const button = document.createElement('button');
                            button.className = 'tarefas';
                            button.textContent = etapa['etapa'];
                            button.value = etapa['etapa'];
                            button.addEventListener('click', function () {
                                editarEtapa(this);
                            });
  
  
                            div.appendChild(button);
                            div.appendChild(buttonExcluir);
                            container.appendChild(div);
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
  
  
    function adicionarEtapa(tipoDaEtapa) {
        if (tipoDaEtapa == 'interacao') {
            console.log('ADD ETAPA INTERACAO');
            var elementSelector = document.querySelector('[id="selector_css_elemento"]');
            var elementIndex = document.querySelector('[id="index_do_elemento"]');
            var elementPreencherInput = document.querySelector('[id="preencher_input"]');
            var elementDelay = document.querySelector('[id="delay_ms"]');
  
        } else if (tipoDaEtapa == 'navegacao') {
            console.log('ADD NEVAGECAO');
            var elementNavegacao = document.querySelector('[id="url_navegacao"]');
            var elementDelay = document.querySelector('[id="delay_ms"]');
        }
  
        if (tipoDaEtapa == 'interacao' && elementSelector.value && elementIndex.value && elementDelay.value || tipoDaEtapa == 'navegacao' && elementNavegacao.value && elementDelay.value) {
            DLTESTERDATA['etapa_atual'] = 0;
            DLTESTERDATA['status_gravacao'] = 'em_disponibilidade';
  
            if (tipoDaEtapa == 'interacao') {
                var data = {
                    "etapa": getNumEtapa(),
                    "tipo_da_etapa": "interacao",
                    "seletor_css": elementSelector.value,
                    "index_do_elemento": +elementIndex.value,
                    "inputValue": elementPreencherInput.value,
                    "delay": +elementDelay.value,
                }
            } else {
                var data = {
                    "etapa": getNumEtapa(),
                    "tipo_da_etapa": "navegacao",
                    "navegar_para": elementNavegacao.value,
                    "delay": +elementDelay.value,
                }
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
  
            const elementNavegacao = document.querySelector('[id="url_navegacao"]');
            const elementDelay = document.querySelector('[id="delay_ms"]');
  
            elementNavegacao.value = objetoEtapa['navegar_para'];
            elementDelay.value = objetoEtapa['delay'];
        }
  
        if (objetoEtapa['tipo_da_etapa'] == 'datalayer') {
  
        }
    }
  
  
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
  
    function executarGravacoes(todas = false) {
        if (typeof DLTESTERDATA != 'undefined') {
            // Altera o status para execução
            DLTESTERDATA['status_gravacao'] = 'em_execucao';
            salvarEtapas();
        }
  
        const DLTESTERDATA_KEY = 'DLTESTERDATA';
        const DLTESTERDATA_LOG_KEY = 'DLTESTERDATA_LOG';
  
        // Carrega os dados do localStorage
        function loadTesterData(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }
  
        // Salva os dados no localStorage
        function saveTesterData(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
  
        // Função para processar uma etapa
        async function processStep(step, recording) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let status = 'falha';
                    if (step.tipo_da_etapa === 'interacao') {
                        const elements = document.querySelectorAll(step.seletor_css);
                        if (elements && elements[step.index_do_elemento]) {
                            const element = elements[step.index_do_elemento];
  
                            // Realiza o clique no elemento
                            element.click();
                            console.log(`Etapa ${step.etapa}: Clique realizado no seletor ${step.seletor_css}`);
  
                            // Verifica se é um input e preenche com o valor, se disponível
                            if ((element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') && step.inputValue !== undefined) {
                                element.value = step.inputValue;
                                element.dispatchEvent(new Event('input', { bubbles: true })); // Dispara evento para atualizar o DOM
                                console.log(`Etapa ${step.etapa}: Input preenchido com valor '${step.inputValue}'`);
                            }
  
                            step.status_da_etapa = 'sucesso';
                            document.querySelector(`button[value="${step.etapa}"]`).style.backgroundColor = 'rgb(95 255 107)';
                            status = 'sucesso';
                        } else {
                            console.warn(`Etapa ${step.etapa}: Elemento não encontrado para o seletor ${step.seletor_css}`);
                            step.status_da_etapa = 'falha';
                            document.querySelector(`button[value="${step.etapa}"]`).style.backgroundColor = 'rgb(255 95 95)';
                        }
                    } else if (step.tipo_da_etapa === 'navegacao') {
                        console.log(`Etapa ${step.etapa}: Navegando para ${step.navegar_para}`);
                        step.status_da_etapa = 'sucesso';
                        status = 'sucesso';
                        window.location.href = step.navegar_para;
                    }
  
                    // Atualizar log no localStorage
                    const logData = loadTesterData(DLTESTERDATA_LOG_KEY);
                    logData.push({
                        id_gravacao: recording.id_gravacao,
                        etapa: step.etapa,
                        tipo_da_etapa: step.tipo_da_etapa,
                        seletor_css: step.seletor_css || '',
                        navegar_para: step.navegar_para || '',
                        index_do_elemento: step.index_do_elemento || 0,
                        inputValue: step.inputValue || '',
                        status_da_etapa: status,
                        delay: step.delay
                    });
                    saveTesterData(DLTESTERDATA_LOG_KEY, logData);
  
                    resolve();
                }, step.delay);
            });
        }
  
        // Função para executar as etapas
        async function executeSteps() {
            let testerData = loadTesterData(DLTESTERDATA_KEY);
  
            if (todas) {
                for (let recording of testerData) {
                    recording.status_gravacao = 'em_execucao';
                    saveTesterData(DLTESTERDATA_KEY, testerData);
                }
            }
  
            for (let recording of testerData) {
                // CASO TENHA UMA GRAVACAO SENDO EXECUTADA NO MOMENTO
                if (recording.status_gravacao === 'em_execucao') {
                    if (document.querySelector('[id="validaEtapas"]') != true) {
                        window.DLTESTERDATA = obterGravacaoById(recording.id_gravacao);
                        htmlGravacoes();
                        const logData = loadTesterData(DLTESTERDATA_LOG_KEY);
                        if (logData && logData.length > 0) {
                            for (let step of logData) {
                                if (step.id_gravacao == DLTESTERDATA.id_gravacao) {
                                    const etapaElement = document.querySelector(`button[value="${step.etapa}"]`);
                                    if (etapaElement && step.status_da_etapa == 'sucesso') {
                                        etapaElement.style.backgroundColor = 'rgb(95 255 107)';
                                    }
  
                                    if (etapaElement && step.status_da_etapa == 'falha') {
                                        etapaElement.style.backgroundColor = 'rgb(255 95 95)';
                                    }
                                }
  
                            }
                        }
  
                    }
  
                    const steps = recording.etapas;
                    for (let i = recording.etapa_atual; i < steps.length; i++) {
                        const step = steps[i];
                        console.log(`Executando etapa ${step.etapa} da gravação ${recording.id_gravacao}`);
                        await processStep(step, recording);
                        recording.etapa_atual = i + 1;
                        saveTesterData(DLTESTERDATA_KEY, testerData);
                    }
  
                    console.log(`Gravação ${recording.id_gravacao} concluída`);
                    recording.status_gravacao = 'concluido';
                    recording.etapa_atual = 0;
                    saveTesterData(DLTESTERDATA_KEY, testerData);
                }
            }
  
            // Resetar os status após concluir todas as gravações
            testerData.forEach((recording) => {
                if (recording.status_gravacao === 'concluido') {
                    recording.status_gravacao = 'em_disponibilidade';
                    recording.etapa_atual = 0;
                }
            });
  
            saveTesterData(DLTESTERDATA_KEY, testerData);
            console.log('Todas as gravações foram processadas e os status foram resetados.');
  
            // Gerar CSV e baixar
            generateCSV();
        }
  
        // Função para gerar CSV a partir dos dados do log salvo no localStorage
        function generateCSV() {
            const logData = loadTesterData(DLTESTERDATA_LOG_KEY); // Carrega o log salvo
  
            if (!logData || logData.length == 0) {
                return;
            }
  
            const csvHeader = "ID da Gravação,Etapa,Tipo da Etapa,Status da Etapa,Delay,Navegar para,Seletor CSS,Index do elemento, Valor do input\n";
            const csvRows = logData.map(log =>
                `${log.id_gravacao},${log.etapa},${log.tipo_da_etapa},${log.status_da_etapa},${log.delay}, ${log.delay},  ${log.navegar_para}, ${log.seletor_css}, ${log.index_do_elemento}, ${log.inputValue}`
            );
            const csvContent = csvHeader + csvRows.join("\n");
  
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'DLTESTERDATA_LOG.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
  
            // Limpar log após download
            localStorage.removeItem(DLTESTERDATA_LOG_KEY);
        }
  
        // Inicia o processo
        executeSteps();
    }
  
  
  // Função para verificar e remover o atributo tabindex="-1"
  function removeTabIndexAttribute() {
      // Seleciona todos os elementos com tabindex="-1"
      const elements = document.querySelectorAll('[tabindex="-1"]');
      elements.forEach((element) => {
        element.removeAttribute('tabindex');
        console.log('Atributo tabindex removido:', element);
      });
    }
    
    // Configura um observer para monitorar mudanças no DOM
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        // Verifica se novos nós foram adicionados
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Se o elemento tiver tabindex="-1", remove o atributo
            if (node.hasAttribute && node.hasAttribute('tabindex') && node.getAttribute('tabindex') === '-1') {
              node.removeAttribute('tabindex');
              console.log('Atributo tabindex removido:', node);
            }
    
            // Verifica também os filhos do nó adicionado
            removeTabIndexAttribute();
          }
        });
      });
    });
    
    // Inicia o observer observando alterações no documento inteiro
    observer.observe(document.body, { childList: true, subtree: true });
    
  
    function associaBotoes() {
      document.addEventListener('click', (event) => {
          const janelaPrincipal = document.getElementById('janelaPrincipal');
          if (!janelaPrincipal || !janelaPrincipal.contains(event.target)) {
              return; // Ignora cliques fora de `#janelaPrincipal`
          }
  
          // Mapeamento de elementos para funções baseado em `id`, `class` e `data-action`
          const functionMap = {
              'close-button': () => {
                  const botaoGravarEtapa = document.querySelector('.botao-add-etapa');
                  if (botaoGravarEtapa) {
                      htmlGravacoes();
                      closeEditEtapa();
                  } else {
                      const botaoProsseguir = document.querySelector('.botao-prosseguir');
                      if (botaoProsseguir) {
                          const janela = document.getElementById('janelaPrincipal');
                          janela.hidden = true;
                      } else {
                          htmlStart();
                          closeEditEtapa();
                      }
                  }
              },
              'botao-prosseguir': () => {
                  objetoDLTESTERDATA();
              },
              'testar-gravacoes': () => {
                  executarGravacoes(true);
              },
              'validaEtapas': () => {
                  executarGravacoes();
              },
              'interagir-com-elemento': () => {
                  htmlInteracoes();
              },
              'ir-para-pagina': () => {
                  htmlNavegacao();
              },
              'verificar-datalayer': () => {
                  htmlDatalayer();
              },
              'add-interacao': () => {
                  adicionarEtapa("interacao");
              },
              'add-navegacao': () => {
                  adicionarEtapa("navegacao");
              }
          };
  
          // Encontra o elemento clicado ou seu ancestral mais próximo com `id`, `class` ou `data-action`
          const closestElement = event.target.closest('[id], [class], [data-action]');
  
          if (closestElement) {
              // Verifica por `id`
              if (closestElement.id && functionMap[closestElement.id]) {
                  functionMap[closestElement.id]();
                  return;
              }
  
              // Verifica por `class`
              closestElement.classList.forEach((className) => {
                  if (functionMap[className]) {
                      functionMap[className]();
                      return;
                  }
              });
  
              // Verifica por `data-action`
              if (closestElement.dataset.action && functionMap[closestElement.dataset.action]) {
                  functionMap[closestElement.dataset.action]();
                  return;
              }
          }
  
        //   console.log('Nenhuma ação definida para este elemento:', event.target);
      });
  }
  
  
    (function () {
        // Criação do HTML da interface
        const interfaceHTML = `
        <body>
            <div id="janelaPrincipal">
                <script>
                    htmlStart();
                </script>
  
        `;
  
        // Injetando o HTML no corpo da página
        document.body.insertAdjacentHTML('beforeend', interfaceHTML);
  
        // Estilos CSS a serem injetados
        const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');
  
        #janelaPrincipal *,
        #janelaPrincipal input,
        #janelaPrincipal .botao-superior,
        #janelaPrincipal .tarefas,
        #janelaPrincipal .botao-add-etapa,
        #janelaPrincipal .botao-prosseguir,
        #janelaPrincipal .testar-gravacoes,
        #janelaPrincipal #botao-add-gravacao,
        #janelaPrincipal #container-lista-de-gravacoes,
        #janelaPrincipal .gravacao {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
        }
  
        #janelaPrincipal .botao-superior,
        #janelaPrincipal .tarefas {
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
  
        #janelaPrincipal .div-botoes-superiores,
        #janelaPrincipal .div-inputs-superiores {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 25px;
        }
  
        #janelaPrincipal .botao-superior,
        #janelaPrincipal .input-superior {
            background-color: rgb(217, 217, 217);
            color: black;
            border: 3px solid;
            border-radius: 10px;
            padding: 10px 10px;
        }
  
        #janelaPrincipal #container-tarefas {
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
  
        #janelaPrincipal #div-tarefas {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
            justify-content: space-between;
            align-content: center;
        }
  
        #janelaPrincipal .tarefas {
            background-color: rgb(104, 195, 202);
            color: black;
            border-radius: 10px;
            width: 40px;
            height: 40px;
            border: 3px solid;
        }
  
        #janelaPrincipal #botao-add-gravacao {
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
  
        #janelaPrincipal .botao-add-etapa, 
        #janelaPrincipal .botao-prosseguir {
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
  
        #janelaPrincipal .sub-input {
            display: flex;
            justify-content: space-between;
        }
  
        #janelaPrincipal input {
            font-size: 14px;
            color: #000000;
            font-weight: 700;
            text-align: center;
            box-sizing: border-box !important;
        }
  
        #janelaPrincipal input::placeholder {
            color: #000000;
            font-size: 14px;
            text-align: center;
        }
  
        #janelaPrincipal #validaEtapas {
            position: absolute;
            bottom: 250px;
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
  
        #janelaPrincipal .gravacao {
            background-color: white;
            border-radius: 10px;
            padding: 10px;
            border: solid 3px;
        }
  
        #janelaPrincipal #lista-de-gravacoes {
            display: flex;
            flex-wrap: nowrap;
            flex-direction: column;
            padding: 10px 10px;
            gap: 10px;
            background-color: #ffeef7;
            overflow-y: auto;
            height: 100%;
        }
  
        #janelaPrincipal button {
            cursor: pointer;
            box-sizing: border-box !important;
        }
  
        #janelaPrincipal .excluir-item {
            position: relative;
            border-radius: 10px;
            width: 10px;
            height: 15px;
            background-color: #ff0b0bfc;
        }
  
        #janelaPrincipal .excluir-etapa {
            left: 70%;
            top: -80%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: 800;
            color: white;
            height: 15px;
            width: 15px;
            border: solid black 2px;
            
        }
  
        #janelaPrincipal .excluir-gravacao {
            left: 95%;
            top: -50px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: 800;
            color: white;
            height: 15px;
            width: 15px;
            border: solid black 2px;
        }


        #janelaPrincipal .close-button {
            height: 30px;
            width: 30px;
            box-sizing: border-box !important;
        }


        #janelaPrincipal #list-button-datalayer {
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgb(255 255 255);
            height: 200px;
            width: 260px;
            color: black;
            border: 3px solid;
            border-radius: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: center;
        }

        #janelaPrincipal #object-to-validation {
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgb(255, 255, 255);
                height: 200px;
                width: 260px;
                color: black;
                border: 3px solid;
                border-radius: 15px;
                overflow-y: auto;
                font-size: 10px;
        }

        #janelaPrincipal .button-from-datalayer {
            height: 40px;
            width: 180px;
            background-color: #fffeae;
            flex-shrink: 0;
            margin-top: 15px;
            position: relative;
        }


   .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 25px;
    }

    /* Esconde o botão de rádio original */
    .toggle-switch input[type="radio"] {
      display: none;
    }

    /* Estilo da "caixa" do toggle */
    .slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 25px;
      transition: background-color 0.3s;
      cursor: pointer;
    }

    /* Estilo do círculo do toggle */
    .slider::before {
      content: '';
      position: absolute;
      height: 19px;
      width: 19px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }

    /* Quando o botão está selecionado */
    input[type="radio"]:checked + .slider {
      background-color: #4caf50;
    }

    /* Move o círculo para a direita quando selecionado */
    input[type="radio"]:checked + .slider::before {
      transform: translateX(25px);
    }
        `;

  
        // Criando um elemento de estilo e injetando na página
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
    })();
  
    htmlStart();
    associaBotoes();
    executarGravacoes();
    dragAndDrop();
    removeTabIndexAttribute();
    ensureInputAccessibility();
  
  })();
