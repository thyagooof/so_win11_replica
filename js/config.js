export const APP_ID = {
    COPILOT: 'copilot', EDGE: 'edge', NOTEPAD: 'notepad',
    CALCULATOR: 'calculator', VSCODE: 'vscode', SETTINGS: 'settings',
    EXPLORER: 'explorer', STORE: 'store',
    YOUTUBE: 'youtube', SPOTIFY: 'spotify', DISCORD: 'discord', GMAIL: 'gmail', CANVA: 'canva',
    SNAKE: 'snake', TETRIS: 'tetris'
};

export const WALLPAPER_DARK = "https://4kwallpapers.com/images/walls/thumbs_3t/5630.jpg";
export const WALLPAPER_LIGHT = "https://4kwallpapers.com/images/walls/thumbs_3t/5616.jpg";
export const WALLPAPER_URL = WALLPAPER_DARK;

export const ICONS = {
    [APP_ID.COPILOT]: 'bot', [APP_ID.EDGE]: 'globe', [APP_ID.NOTEPAD]: 'file-text',
    [APP_ID.CALCULATOR]: 'calculator', [APP_ID.VSCODE]: 'code', [APP_ID.SETTINGS]: 'settings',
    [APP_ID.EXPLORER]: 'folder-open', [APP_ID.STORE]: 'shopping-bag',
    [APP_ID.YOUTUBE]: 'youtube', [APP_ID.SPOTIFY]: 'music', [APP_ID.DISCORD]: 'gamepad-2', 
    [APP_ID.GMAIL]: 'mail', [APP_ID.CANVA]: 'palette',
    [APP_ID.SNAKE]: 'activity', [APP_ID.TETRIS]: 'layout-dashboard',
    'folder': 'folder', 'image': 'image', 'unknown': 'file', 'hard-drive': 'hard-drive'
};

export const COLORS = {
    [APP_ID.COPILOT]: 'text-sky-500', [APP_ID.EDGE]: 'text-blue-600', [APP_ID.NOTEPAD]: 'text-slate-500',
    [APP_ID.CALCULATOR]: 'text-orange-500', [APP_ID.VSCODE]: 'text-blue-500', [APP_ID.SETTINGS]: 'text-gray-500',
    [APP_ID.EXPLORER]: 'text-yellow-500', [APP_ID.STORE]: 'text-blue-400',
    [APP_ID.YOUTUBE]: 'text-red-600', [APP_ID.SPOTIFY]: 'text-green-500', [APP_ID.DISCORD]: 'text-indigo-500',
    [APP_ID.GMAIL]: 'text-red-500', [APP_ID.CANVA]: 'text-purple-500',
    [APP_ID.SNAKE]: 'text-green-600', [APP_ID.TETRIS]: 'text-purple-600',
    'folder': 'text-yellow-500', 'image': 'text-purple-500', 'unknown': 'text-gray-400', 'hard-drive': 'text-gray-500'
};

export const TRANSLATIONS = {
    en: {
        startMenu: { searchPlaceholder: 'Search for apps, settings, and documents', pinned: 'Pinned', allApps: 'All apps', recommended: 'Recommended', more: 'More', user: 'User', search: 'Search', folder: 'Folder', editName: 'Edit Name' },
        taskbar: { search: 'Search', widgets: 'Cloudy' },
        contextMenu: { 
            open: 'Open', closeWindow: 'Close window', pinToStart: 'Pin to Start', unpinFromStart: 'Unpin from Start', 
            pinToTaskbar: 'Pin to taskbar', unpinFromTaskbar: 'Unpin from taskbar', rename: 'Rename', changeIcon: 'Change Icon', 
            delete: 'Delete', uninstall: 'Uninstall', cancel: 'Cancel', save: 'Save', removeFromFolder: 'Remove from folder',
            enterUrl: 'Enter Icon URL', enterName: 'Enter new name', properties: 'Properties', openFileLocation: 'Open file location', createShortcut: 'Create shortcut'
        },
        properties: { general: 'General', type: 'Type of file:', loc: 'Location:', size: 'Size:', created: 'Created:', modified: 'Modified:', shortcut: 'Shortcut' },
        explorer: { home: 'Home', desktop: 'Desktop', documents: 'Documents', downloads: 'Downloads', pictures: 'Pictures', system: 'Local Disk (C:)', thisPC: 'This PC', items: 'items' },
        store: { title: 'Microsoft Store', home: 'Home', apps: 'Apps', gaming: 'Gaming', library: 'Library', get: 'Get', open: 'Open', installing: 'Installing...', downloading: 'Downloading...' },
        apps: { 
            [APP_ID.COPILOT]: 'Copilot', [APP_ID.EDGE]: 'Microsoft Edge', [APP_ID.NOTEPAD]: 'Notepad', 
            [APP_ID.CALCULATOR]: 'Calculator', [APP_ID.VSCODE]: 'Visual Studio Code', [APP_ID.SETTINGS]: 'Settings', 
            [APP_ID.EXPLORER]: 'File Explorer', [APP_ID.STORE]: 'Microsoft Store',
            [APP_ID.YOUTUBE]: 'YouTube', [APP_ID.SPOTIFY]: 'Spotify', [APP_ID.DISCORD]: 'Discord', [APP_ID.GMAIL]: 'Gmail', [APP_ID.CANVA]: 'Canva',
            [APP_ID.SNAKE]: 'Snake Game', [APP_ID.TETRIS]: 'Tetris Block'
        },
        settings: { 
            nav: { system: 'System', personalization: 'Personalization', time: 'Time & language' },
            titles: { system: 'System', personalization: 'Personalization', time: 'Time & language' },
            theme: { title: 'Select a theme', light: 'Light', dark: 'Dark' },
            bg: { title: 'Background', label: 'Image URL', placeholder: 'Paste image URL here...', apply: 'Apply', presets: 'Presets' },
            lang: { title: 'Language & region', label: 'Windows display language' },
            // IMPORTANTE: Estas chaves são necessárias para o SettingsApp não quebrar
            system: {
                menu: { notif: 'Notifications', storage: 'Storage', recovery: 'Recovery', about: 'About' },
                desc: { notif: 'Alerts from apps and system', storage: 'Storage space, drives', recovery: 'Reset, advanced startup', about: 'Device specifications, rename PC' },
                headers: { notif: 'Notifications from apps and other senders', storage: 'Local Disk (C:)', recovery: 'Fix problems without resetting your PC', about: 'Device specifications' }
            }
        }
    },
    'pt-BR': {
        startMenu: { searchPlaceholder: 'Buscar aplicativos, configurações e documentos', pinned: 'Fixado', allApps: 'Todos os apps', recommended: 'Recomendado', mais: 'Mais', user: 'Usuário', search: 'Buscar', folder: 'Pasta', editName: 'Editar Nome' },
        taskbar: { search: 'Buscar', widgets: 'Nublado' },
        contextMenu: { 
            open: 'Abrir', closeWindow: 'Fechar janela', pinToStart: 'Fixar no Iniciar', unpinFromStart: 'Desafixar do Iniciar', 
            pinToTaskbar: 'Fixar na barra de tarefas', unpinFromTaskbar: 'Desafixar da barra de tarefas', rename: 'Renomear', changeIcon: 'Alterar ícone', 
            delete: 'Excluir', uninstall: 'Desinstalar', cancel: 'Cancelar', save: 'Salvar', removeFromFolder: 'Remover da pasta',
            enterUrl: 'URL do ícone', enterName: 'Novo nome', properties: 'Propriedades', openFileLocation: 'Abrir local do arquivo', createShortcut: 'Criar atalho'
        },
        properties: { general: 'Geral', type: 'Tipo de arquivo:', loc: 'Local:', size: 'Tamanho:', created: 'Criado em:', modified: 'Modificado em:', shortcut: 'Atalho' },
        explorer: { home: 'Início', desktop: 'Área de Trabalho', documents: 'Documentos', downloads: 'Downloads', pictures: 'Imagens', system: 'Disco Local (C:)', thisPC: 'Este Computador', items: 'itens' },
        store: { title: 'Microsoft Store', home: 'Início', apps: 'Aplicativos', gaming: 'Jogos', library: 'Biblioteca', get: 'Adquirir', open: 'Abrir', installing: 'Instalando...', downloading: 'Baixando...' },
        apps: { 
            [APP_ID.COPILOT]: 'Copilot', [APP_ID.EDGE]: 'Microsoft Edge', [APP_ID.NOTEPAD]: 'Bloco de Notas', 
            [APP_ID.CALCULATOR]: 'Calculadora', [APP_ID.VSCODE]: 'Visual Studio Code', [APP_ID.SETTINGS]: 'Configurações', 
            [APP_ID.EXPLORER]: 'Explorador de Arquivos', [APP_ID.STORE]: 'Microsoft Store',
            [APP_ID.YOUTUBE]: 'YouTube', [APP_ID.SPOTIFY]: 'Spotify', [APP_ID.DISCORD]: 'Discord', [APP_ID.GMAIL]: 'Gmail', [APP_ID.CANVA]: 'Canva',
            [APP_ID.SNAKE]: 'Jogo da Cobrinha', [APP_ID.TETRIS]: 'Blocos Tetris'
        },
        settings: { 
            nav: { system: 'Sistema', personalization: 'Personalização', time: 'Hora e idioma' },
            titles: { system: 'Sistema', personalization: 'Personalização', time: 'Hora e idioma' },
            theme: { title: 'Selecionar um tema', light: 'Claro', dark: 'Escuro' },
            bg: { title: 'Plano de fundo', label: 'URL da Imagem', placeholder: 'Cole a URL da imagem aqui...', apply: 'Aplicar', presets: 'Pré-definidos' },
            lang: { title: 'Idioma e região', label: 'Idioma de exibição do Windows' },
            // IMPORTANTE:
            system: {
                menu: { notif: 'Notificações', storage: 'Armazenamento', recovery: 'Recuperação', about: 'Sobre' },
                desc: { notif: 'Alertas de aplicativos e do sistema', storage: 'Espaço de armazenamento, unidades', recovery: 'Redefinir, inicialização avançada', about: 'Especificações do dispositivo, renomear PC' },
                headers: { notif: 'Notificações de aplicativos e outros remetentes', storage: 'Disco Local (C:)', recovery: 'Corrigir problemas sem redefinir o computador', about: 'Especificações do dispositivo' }
            }
        }
    }
};
