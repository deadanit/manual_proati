// Template base reutilizável para todas as páginas
class LayoutTemplate {
    constructor() {
        this.currentPage = 'home';
        this.menuItems = [
            { id: 'home', title: '🏠 Início', icon: '🏠' },
            { id: 'comunicados-nit', title: '📢 Comunicados NIT', icon: '📢' },
            { id: 'levantamentos', title: '📊 Levantamentos', icon: '📊' },
            { id: 'comunicados-seduc', title: '📄 Comunicados SEDUC', icon: '📄' },
            { id: 'equipe', title: '👥 Equipe', icon: '👥' },
            { id: 'conectividade', title: '🌐 Conectividade', icon: '🌐' },
            { id: 'curso-tecnico', title: '🎓 Curso Técnico', icon: '🎓' },
            { id: 'entregas-2025', title: '📦 Entregas 2025', icon: '📦' },
            { id: 'garantia', title: '🛡️ Garantia', icon: '🛡️' },
            { id: 'identificacao', title: '🏷️ Identificação', icon: '🏷️' },
            { id: 'impressoras', title: '🖨️ Impressoras', icon: '🖨️' },
            { id: 'legislacao', title: '⚖️ Legislação', icon: '⚖️' },
            { id: 'sed-email', title: '📧 SED e E-mail', icon: '📧' },
            { id: 'suporte-remoto', title: '🔧 Suporte Remoto', icon: '🔧' },
            { id: 'equipamentos', title: '💻 Todos os Equipamentos', icon: '💻' }
        ];
    }

    // Gera o HTML do header
    generateHeader() {
        return `
            <header class="header">
                <div class="container">
                    <div class="header-content">
                        <div>
                            <div class="logo">Manual PROATI</div>
                            <div class="subtitle">Diretoria de Ensino - Adamantina</div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    // Gera o HTML da sidebar
    generateSidebar() {
        const menuItemsHTML = this.menuItems.map(item => {
            const activeClass = item.id === this.currentPage ? 'active' : '';
            return `<li><a href="#${item.id}" class="${activeClass}" data-page="${item.id}">${item.title}</a></li>`;
        }).join('');

        return `
            <aside class="sidebar">
                <h3>📋 Menu Rápido</h3>
                <ul class="sidebar-menu">
                    ${menuItemsHTML}
                </ul>
            </aside>
        `;
    }

    // Gera o HTML do footer
    generateFooter() {
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h4>📍 Diretoria de Ensino</h4>
                            <p>Região de Adamantina</p>
                            <p>Estado de São Paulo</p>
                        </div>
                        <div class="footer-section">
                            <h4>📞 Contato NIT</h4>
                            <p>E-mail: deadanit@educacao.sp.gov.br</p>
                            <p>WhatsApp: (18) 3502-2303</p>
                        </div>
                        <div class="footer-section">
                            <h4>🕒 Horário de Atendimento</h4>
                            <p>Segunda a Sexta</p>
                            <p>8:00-13:00 e 13:30-17:30</p>
                        </div>
                    </div>
                    <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                        © 2025 Manual de Sobrevivência do PROATI - DE Adamantina
                    </p>
                </div>
            </footer>
        `;
    }

    // Gera o container principal para o conteúdo
    generateMainContainer(content) {
        return `
            <div class="container">
                <div class="main-layout">
                    ${this.generateSidebar()}
                    <main class="main-content fade-in">
                        ${content}
                    </main>
                </div>
            </div>
        `;
    }

    // Gera o layout completo da página
    generateFullLayout(pageContent, pageTitle = 'Manual PROATI DE Adamantina') {
        return `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${pageTitle}</title>
                <meta name="description" content="Manual de Sobrevivência do PROATI - Diretoria de Ensino de Adamantina">
                <link rel="stylesheet" href="css/style.css">
            </head>
            <body>
                ${this.generateHeader()}
                ${this.generateMainContainer(pageContent)}
                ${this.generateFooter()}
                <script src="js/layout-template.js"></script>
                <script src="js/page-loader.js"></script>
                <script src="js/script.js"></script>
            </body>
            </html>
        `;
    }

    // Atualiza apenas o conteúdo principal (para SPA)
    updateContent(content, pageId) {
        this.currentPage = pageId;
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.querySelector('.sidebar');
        
        if (mainContent) {
            mainContent.innerHTML = content;
            mainContent.classList.add('fade-in');
        }

        // Atualiza links ativos na sidebar
        if (sidebar) {
            const links = sidebar.querySelectorAll('a');
            links.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === pageId) {
                    link.classList.add('active');
                }
            });
        }

        // Atualiza título da página
        document.title = this.getPageTitle(pageId);
    }

    // Retorna o título da página baseado no ID
    getPageTitle(pageId) {
        const menuItem = this.menuItems.find(item => item.id === pageId);
        const baseTitle = 'Manual PROATI DE Adamantina';
        
        if (menuItem && pageId !== 'home') {
            return `${menuItem.title.replace(/[📢📊📄👥🌐🎓📦🛡️🏷️🖨️⚖️📧🔧💻]/g, '').trim()} - ${baseTitle}`;
        }
        
        return baseTitle;
    }

    // Inicializa o layout na página atual
    init() {
        // Adiciona event listeners para navegação
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[data-page]')) {
                e.preventDefault();
                const pageId = e.target.dataset.page;
                window.pageLoader.loadPage(pageId);
            }
        });

        // Suporte para navegação por hash
        window.addEventListener('hashchange', () => {
            const pageId = window.location.hash.slice(1) || 'home';
            window.pageLoader.loadPage(pageId);
        });

        // Carrega página inicial
        const initialPage = window.location.hash.slice(1) || 'home';
        if (window.pageLoader) {
            window.pageLoader.loadPage(initialPage);
        }
    }
}

// Instância global do template
window.layoutTemplate = new LayoutTemplate();

