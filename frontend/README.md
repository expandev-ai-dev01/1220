# Editor de Música Cifrada

Catálogo de músicas contendo a letra da música e as cifras dos acordes.

## Tecnologias

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.11
- React Router DOM 6.26.2
- TanStack Query 5.59.20
- Tailwind CSS 3.4.14
- Axios 1.7.7
- Zustand 5.0.1
- React Hook Form 7.53.1
- Zod 3.23.8

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   ├── providers.tsx      # Provedores globais
│   └── router.tsx         # Configuração de rotas
├── assets/                # Recursos estáticos
│   └── styles/           # Estilos globais
├── core/                  # Componentes e lógica compartilhada
│   ├── components/       # Componentes genéricos
│   ├── contexts/         # Contextos globais
│   ├── lib/              # Configurações de bibliotecas
│   ├── utils/            # Funções utilitárias
│   ├── constants/        # Constantes globais
│   └── types/            # Tipos TypeScript globais
├── domain/               # Domínios de negócio
└── pages/                # Páginas da aplicação
    └── layouts/          # Layouts compartilhados
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:
```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Funcionalidades Planejadas

- Cadastro de músicas cifradas
- Visualização de músicas
- Edição de cifras
- Busca de músicas
- Transposição de tom
- Organização por categorias
- Exportação de músicas
- Compartilhamento de cifras
- Gerenciamento de usuários
- Criação de playlists

## Arquitetura

O projeto segue uma arquitetura modular baseada em domínios:

- **app/**: Configuração central da aplicação
- **core/**: Componentes e lógica reutilizáveis
- **domain/**: Módulos de negócio isolados
- **pages/**: Componentes de página e layouts

Cada domínio contém:
- `components/`: Componentes específicos do domínio
- `hooks/`: Hooks customizados
- `services/`: Integração com API
- `stores/`: Gerenciamento de estado
- `types/`: Definições de tipos
- `utils/`: Funções utilitárias

## Padrões de Código

- TypeScript estrito habilitado
- Componentes funcionais com hooks
- Separação de lógica e apresentação
- Documentação JSDoc para componentes principais
- Nomenclatura consistente (PascalCase para componentes, camelCase para funções)

## Licença

Proprietary