🍰 Veyra Confeitaria — Vitrine & Catálogo Digital
A Veyra Confeitaria é uma plataforma digital de comércio eletrónico e vitrine interativa desenvolvida para revolucionar a experiência de encomenda de doces artesanais, combinando uma interface elegante com comunicação direta via WhatsApp e sincronização em tempo real através do Supabase. O sistema resolve o problema da fricção nos pedidos online, unificando a apresentação visual do cardápio, a gestão dinâmica de categorias e um fluxo de checkout ágil em um único ambiente limpo, rápido e responsivo.

O seu principal objetivo é oferecer uma experiência de compra fluida e acolhedora, integrando atualizações instantâneas de produtos, controlo de stock e um design sofisticado com paleta âmbar/dourado (#2b1810, #c5a059). Tudo isso construído com foco total em performance e integração direta com o painel administrativo através da nuvem.

🚀 Tecnologias Utilizadas
💻 Core & Interface
React (Vite) — Biblioteca principal para a estruturação dos componentes e reatividade da interface com tempos de build extremamente rápidos.

TypeScript / JavaScript (ES6+) — Linguagem base para tipagem segura, lógica de estado e manipulação eficiente de dados.

Tailwind CSS — Estilização moderna com design responsivo, utilitários avançados e paleta visual personalizada.

Lucide React — Biblioteca de ícones vetoriais modernos para navegação, botões e interface de usuário.

☁️ Backend & Sincronização
Supabase — Plataforma Backend-as-a-Service (BaaS) baseada em PostgreSQL, responsável por gerir a base de dados relacional na nuvem e escutar alterações em tempo real.

Netlify — Plataforma de deploy contínuo, alojamento web e gestão de rotas SPA através de redirecionamentos otimizados.

⚙️ Como Funciona a Arquitetura e a Interligação com o Admin
A Vitrine e o Painel Administrativo (Admin) funcionam como dois ecossistemas independentes no frontend (desdobrados separadamente na Netlify), mas totalmente interligados através da mesma base de dados no Supabase:

Gestão Centralizada de Produtos: Quando o administrador atualiza um preço, altera a descrição de um bolo ou adiciona uma nova categoria no painel de administração, essas alterações são gravadas instantaneamente nas tabelas do Supabase.

Atualização em Tempo Real na Vitrine: Graças aos clientes e ouvintes de dados do Supabase configurados na Vitrine, qualquer alteração feita pelo pasteleiro/admin reflete-se de imediato para os clientes que estão a navegar no catálogo digital, sem necessidade de atualizar a página.

Fluxo de Encomendas Integrado:

O cliente escolhe os produtos na Vitrine e submete o pedido.

O pedido é inserido diretamente na tabela orders do Supabase.

O Painel Administrativo capta esse novo pedido em tempo real, permitindo ao pasteleiro gerir o estado da produção, atualizar o progresso e disparar mensagens ou notificações via WhatsApp.

O sistema conta com rotinas de limpeza automática de pedidos confirmados para manter a base de dados sempre limpa e organizada.
