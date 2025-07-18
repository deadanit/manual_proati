// Carregador de páginas que usa arquivos HTML externos
class PageLoader {
    constructor() {
        this.pages = {};
        this.currentPage = 'home';
        this.loadingIndicator = this.createLoadingIndicator();
        this.cache = new Map(); // Cache para arquivos HTML carregados
    }

    // Cria indicador de carregamento
    createLoadingIndicator() {
        return `
            <div class="loading-container" style="text-align: center; padding: 50px;">
                <div class="loading-spinner" style="
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p>Carregando página...</p>
            </div>
        `;
    }

    // Registra uma página no sistema (agora com caminho do arquivo HTML)
    registerPage(pageId, htmlFilePath, pageTitle = null) {
        this.pages[pageId] = {
            htmlPath: htmlFilePath,
            title: pageTitle || this.getDefaultTitle(pageId)
        };
    }

    // Retorna título padrão baseado no ID da página
    getDefaultTitle(pageId) {
        const titles = {
            'home': 'Manual PROATI DE Adamantina',
            'comunicados-nit': 'Comunicados NIT - Manual PROATI DE Adamantina',
            'levantamentos': 'Levantamentos - Manual PROATI DE Adamantina',
            'comunicados-seduc': 'Comunicados SEDUC - Manual PROATI DE Adamantina',
            'equipe': 'Equipe - Manual PROATI DE Adamantina',
            'conectividade': 'Conectividade - Manual PROATI DE Adamantina',
            'curso-tecnico': 'Curso Técnico - Manual PROATI DE Adamantina',
            'entregas-2025': 'Entregas 2025 - Manual PROATI DE Adamantina',
            'garantia': 'Garantia - Manual PROATI DE Adamantina',
            'identificacao': 'Identificação - Manual PROATI DE Adamantina',
            'impressoras': 'Impressoras - Manual PROATI DE Adamantina',
            'legislacao': 'Legislação - Manual PROATI DE Adamantina',
            'sed-email': 'SED e E-mail - Manual PROATI DE Adamantina',
            'suporte-remoto': 'Suporte Remoto - Manual PROATI DE Adamantina',
            'equipamentos': 'Equipamentos - Manual PROATI DE Adamantina'
        };
        return titles[pageId] || 'Manual PROATI DE Adamantina';
    }

    // Carrega arquivo HTML via fetch
    async loadHTMLFile(filePath) {
        try {
            // Verifica cache primeiro
            if (this.cache.has(filePath)) {
                return this.cache.get(filePath);
            }

            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Armazena no cache
            this.cache.set(filePath, html);
            
            return html;
        } catch (error) {
            console.error(`Erro ao carregar arquivo HTML: ${filePath}`, error);
            throw error;
        }
    }

    // Carrega uma página específica
    async loadPage(pageId) {
        if (!this.pages[pageId]) {
            console.warn(`Página '${pageId}' não encontrada. Carregando página inicial.`);
            pageId = 'home';
        }

        // Mostra indicador de carregamento
        this.showLoading();

        try {
            // Carrega conteúdo HTML do arquivo
            const pageInfo = this.pages[pageId];
            const htmlContent = await this.loadHTMLFile(pageInfo.htmlPath);
            
            // Atualiza o layout
            window.layoutTemplate.updateContent(htmlContent, pageId);
            
            // Atualiza título da página
            document.title = pageInfo.title;
            
            // Atualiza URL sem recarregar
            if (pageId !== 'home') {
                window.history.pushState({page: pageId}, '', `#${pageId}`);
            } else {
                window.history.pushState({page: pageId}, '', window.location.pathname);
            }

            this.currentPage = pageId;

            // Reinicializa scripts específicos da página
            this.initPageScripts();

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.showError(error.message);
        }
    }

    // Mostra indicador de carregamento
    showLoading() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = this.loadingIndicator;
        }
    }

    // Mostra mensagem de erro
    showError(errorMessage = 'Erro desconhecido') {
        const errorContent = `
            <div class="error-container" style="text-align: center; padding: 50px;">
                <h2 style="color: #ef4444;">❌ Erro ao Carregar Página</h2>
                <p>Ocorreu um erro ao carregar o conteúdo:</p>
                <p style="background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; margin: 20px 0;">
                    ${errorMessage}
                </p>
                <button onclick="window.pageLoader.loadPage('home')" class="btn btn-primary" style="
                    background: #3b82f6; 
                    color: white; 
                    padding: 10px 20px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 16px;
                ">
                    🏠 Voltar ao Início
                </button>
                <button onclick="window.pageLoader.loadPage('${this.currentPage}')" class="btn btn-secondary" style="
                    background: #6b7280; 
                    color: white; 
                    padding: 10px 20px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 16px;
                    margin-left: 10px;
                ">
                    🔄 Tentar Novamente
                </button>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = errorContent;
        }
    }

    // Inicializa scripts específicos da página
    initPageScripts() {
        // Reinicializa busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.initSearch(searchInput);
        }

        // Reinicializa animações
        this.initAnimations();

        // Reinicializa outros componentes conforme necessário
        this.initPageSpecificFeatures();

        // Reinicializa links internos
        this.initInternalLinks();
    }

    // Inicializa funcionalidade de busca
    initSearch(searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const contentElements = document.querySelectorAll('.main-content h1, .main-content h2, .main-content h3, .main-content p, .main-content li');
            
            contentElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const parent = element.closest('section, div, article') || element.parentElement;
                
                if (text.includes(searchTerm) || searchTerm === '') {
                    parent.style.display = '';
                    element.style.backgroundColor = searchTerm ? '#fff3cd' : '';
                } else {
                    if (searchTerm && parent) {
                        parent.style.display = 'none';
                    }
                }
            });
        });
    }

    // Inicializa links internos para navegação SPA
    initInternalLinks() {
        const internalLinks = document.querySelectorAll('a[href^="#"], a[data-page]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page') || link.getAttribute('href').slice(1);
                if (pageId && this.pages[pageId]) {
                    this.loadPage(pageId);
                }
            });
        });
    }

    // Inicializa animações
    initAnimations() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.classList.remove('fade-in');
            setTimeout(() => {
                mainContent.classList.add('fade-in');
            }, 10);
        }
    }

    // Inicializa recursos específicos da página
    initPageSpecificFeatures() {
        // Aqui você pode adicionar inicializações específicas
        // baseadas na página atual (this.currentPage)
        
        switch(this.currentPage) {
            case 'levantamentos':
                this.initLevantamentosFeatures();
                break;
            case 'conectividade':
                this.initConectividadeFeatures();
                break;
            case 'comunicados-nit':
                this.initComunicadosFeatures();
                break;
            // Adicione outros casos conforme necessário
        }
    }

    // Recursos específicos da página de levantamentos
    initLevantamentosFeatures() {
        console.log('Inicializando recursos da página de levantamentos');
        // Exemplo: inicializar filtros, ordenação, etc.
    }

    // Recursos específicos da página de conectividade
    initConectividadeFeatures() {
        console.log('Inicializando recursos da página de conectividade');
        // Exemplo: inicializar testes de conectividade, etc.
    }

    // Recursos específicos da página de comunicados
    initComunicadosFeatures() {
        console.log('Inicializando recursos da página de comunicados');
        // Exemplo: inicializar filtros por data, etc.
    }

    // Limpa cache (útil para desenvolvimento)
    clearCache() {
        this.cache.clear();
        console.log('Cache de páginas limpo');
    }

    // Retorna a página atual
    getCurrentPage() {
        return this.currentPage;
    }

    // Lista todas as páginas registradas
    getRegisteredPages() {
        return Object.keys(this.pages);
    }

    // Retorna informações sobre uma página
    getPageInfo(pageId) {
        return this.pages[pageId] || null;
    }

    // Pré-carrega uma página (útil para performance)
    async preloadPage(pageId) {
        if (this.pages[pageId] && !this.cache.has(this.pages[pageId].htmlPath)) {
            try {
                await this.loadHTMLFile(this.pages[pageId].htmlPath);
                console.log(`Página '${pageId}' pré-carregada com sucesso`);
            } catch (error) {
                console.warn(`Erro ao pré-carregar página '${pageId}':`, error);
            }
        }
    }
}

// CSS para animação de loading
const loadingCSS = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
    
    .btn {
        transition: all 0.2s ease;
    }
`;

// Adiciona CSS ao documento
const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style);

// Instância global do carregador
window.pageLoader = new PageLoader();

