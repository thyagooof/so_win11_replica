# 🪟 Windows 11 Web Replica

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![Version](https://img.shields.io/badge/Version-0.0.1_Alfa-green)
![Tech](https://img.shields.io/badge/Tech-Vanilla_JS_|_Tailwind-38bdf8)

Uma recriação impressionante e funcional da interface do desktop do Windows 11, construída inteiramente com tecnologias web modernas (**HTML, CSS e JavaScript Puro**). Este projeto simula o sistema operacional com recursos avançados de gerenciamento de janelas, sistema de arquivos virtual e aplicativos interativos.

---

## ✨ Funcionalidades Principais

### 🖥️ Área de Trabalho (Desktop)
* **Ícones Interativos:** Arraste e solte ícones livremente com sistema de alinhamento à grade (*Snap-to-grid*).
* **Menu de Contexto (Botão Direito):** Clique na área de trabalho ou em ícones para ver opções como *Abrir*, *Renomear*, *Alterar Ícone*, *Propriedades* e *Criar Atalho*.
* **Atalhos Inteligentes:** Diferenciação visual entre arquivos originais e atalhos (com a seta característica).

### 🚀 Menu Iniciar Avançado
* **Pesquisa em Tempo Real:** Filtre aplicativos digitando instantaneamente, sem travar a interface.
* **Pastas de Apps:** Arraste um ícone sobre o outro para criar pastas agrupadas, assim como no Windows 11 original.
* **Vistas Alternadas:** Alterne entre "Fixados" (Pinned) e "Todos os Aplicativos" (Lista alfabética).

### 📂 Explorador de Arquivos (File Explorer)
* **Sistema de Arquivos Virtual (VFS):** Navegue entre pastas como *Desktop*, *Documentos*, *Downloads*, *Imagens* e *Disco Local (C:)*.
* **Integração Real:** O que você vê na pasta "Desktop" do Explorer é exatamente o que está na sua Área de Trabalho.
* **Gerenciamento:** Exclua arquivos, crie atalhos e visualize propriedades detalhadas.

### 🛍️ Microsoft Store Simulada
* **Experiência de Download:** Simulação visual de download e instalação de aplicativos com barra de progresso.
* **Instalação Real (Lógica):** Ao "instalar" um app (ex: YouTube), o executável é criado na pasta do sistema e atalhos são gerados no Menu Iniciar e Área de Trabalho.
* **Desinstalação:** Opção de desinstalar apps baixados através do menu de contexto, removendo-os de todo o sistema.

### ⚙️ Configurações (Settings)
* **Personalização:** Troque entre **Modo Claro** e **Modo Escuro**.
* **Papel de Parede:** Escolha entre presets ou insira uma URL de imagem personalizada.
* **Informações do Sistema:** Visualize especificações fictícias do hardware e versão do sistema.

### 🎮 Jogos e Aplicativos
* **Jogos Nativos:** Jogue **Snake (Cobrinha)** e **Tetris** desenvolvidos em Canvas HTML5, integrados como janelas do sistema.
* **Web Apps:** Versões web do **VS Code**, **Spotify**, **YouTube**, **Discord** e outros rodando em janelas dedicadas.
* **Utilitários:** Calculadora e Bloco de Notas funcionais.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 Semantic:** Estrutura base.
* **CSS3 & Tailwind CSS:** Estilização avançada, animações e responsividade.
* **JavaScript (ES6+ Modules):** Lógica completa, gerenciamento de estado (`Store`), renderização dinâmica e manipulação de DOM.
* **Lucide Icons:** Biblioteca de ícones moderna e leve.

---

## 🚀 Como Rodar o Projeto

Como este projeto utiliza **ES Modules** (`import/export`), você não pode apenas abrir o arquivo `index.html` clicando duas vezes nele (devido à política de CORS dos navegadores). Você precisa de um servidor local.

### Opção 1: VS Code (Recomendado)
1.  Abra a pasta do projeto no **VS Code**.
2.  Instale a extensão **Live Server**.
3.  Clique em "Go Live" no canto inferior direito do editor.

### Opção 2: Python
Se você tem Python instalado, abra o terminal na pasta do projeto e rode:
```bash
python -m http.server
# Abra o navegador em http://localhost:8000