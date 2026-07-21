# 🥗 FitMatch - Módulo de Plano Alimentar & Gestão Nutricional

> **⚠️ Aviso Legal:** As funcionalidades de plano alimentar, contagem de calorias e recomendações nutricionais deste aplicativo possuem caráter exclusivamente informativo e de acompanhamento pessoal. **Elas não substituem a consulta, o diagnóstico ou o acompanhamento de um profissional da saúde qualificado** (como nutricionistas ou médicos).

---

## 📋 Descrição do Projeto
O **FitMatch** é um aplicativo desenvolvido em **React Native** com **Expo** e **TypeScript**, voltado para o acompanhamento de saúde, treinos e nutrição. Este documento detalha a arquitetura, o fluxo de telas, o checklist de funcionalidades do ator e os detalhes técnicos da integração do módulo de **Plano Alimentar** com o **Firebase Firestore**.

---

## 📱 Fluxo de Telas
O módulo de plano alimentar é composto por duas telas principais estruturadas com componentes baseados em classes e tipagem rigorosa:

1. **Tela Principal (`PlanoAlimentar.tsx`)**
   * **Dashboard Diário:** Exibe a data atualizada, resumo calórico do dia com barra de progresso baseada na meta (2.000 kcal).
   * **Listagem de Refeições:** Organiza as refeições cadastradas (Café da manhã, Almoço, Lanche, Jantar) com seus respectivos itens, calorias individuais e totais.
   * **Ações Rápidas por Seção:** 
     * Botão de exclusão rápida (🗑️) posicionado ao lado do título da refeição.
     * Botão de finalização (✔️) para concluir a refeição e redirecionar para a tela de progresso.
     * Botão de adição/edição (+) para gerenciar itens.
   * **Navegação:** Botão flutuante para criação de novas refeições e barra de navegação inferior (`BottomTabs`).

2. **Tela de Cadastro e Edição (`NovaRefeicao.tsx`)**
   * **Seleção de Tipo:** Seletor em abas para escolher entre Café da manhã, Almoço, Lanche ou Jantar.
   * **Nome da Refeição:** Campo de texto livre para personalizar o título (ex: *Jantar leve*).
   * **Gerenciamento de Alimentos:** 
     * Catálogo pré-definido de alimentos com porções e calorias.
     * Sistema de busca rápida de alimentos.
     * Modal interativo para criação de **alimentos personalizados** na hora.
     * Listagem dinâmica de itens adicionados com opção de remoção (-).
   * **Cabeçalho Inteligente:** Ícone de lixeira padronizado no topo (clicável apenas no modo edição, e transparente/não clicável no modo criação).

---

## ✅ Checklist do Ator (Funcionalidades / Use Cases)
* [x] **Visualizar Plano:** O usuário pode visualizar todas as refeições do dia e o total de calorias consumidas.
* [x] **Criar Refeição:** Adicionar uma nova refeição preenchendo o tipo, nome e selecionando/criando alimentos.
* [x] **Editar Refeição:** Modificar uma refeição já existente, adicionando ou removendo itens.
* [x] **Excluir Refeição:** Apagar uma refeição inteira por meio do botão de lixeira (com caixa de confirmação em alerta).
* [x] **Criar Alimento Personalizado:** Cadastrar um alimento customizado informando nome, porção e calorias através de um Modal.
* [x] **Validação de Formulários:** Impedir o salvamento de refeições sem nome ou sem nenhum alimento vinculado.
* [x] **Finalizar Refeição:** Marcar a refeição como concluída e atualizar o fluxo de progresso.

---

## 🔥 Integração com Firebase e Firestore
A persistência dos dados foi integrada utilizando o **Cloud Firestore** através da classe de serviço `PlanoAlimentarService`. 

### Principais Ajustes e Correções na Integração:
1. **Tratamento de Objetos Nativos vs. Firestore (`undefined` -> `null`):**
   * O SDK do Firestore não aceita valores do tipo `undefined` (gerando o erro clássico `Unsupported field value: undefined`).
   * **Solução Implementada:** Antes de enviar os dados para o banco, foi aplicado um mapeamento preventivo nos itens da refeição (`itensParaFirebase`), convertendo campos opcionais ausentes (como emojis) de `undefined` para `null`.
2. **Conversão de Objetos (Pattern `fromPlain`):**
   * Implementação de métodos estáticos de conversão nas classes `Refeicao` e `Alimento` para instanciar corretamente os dados brutos recuperados do banco de dados em objetos estruturados com métodos próprios (como `totalCalorias()` e `tituloExibicao()`).

---

## 🛠️ Alterações e Implementações do CRUD

* **Create (Criar):** Método `salvarRefeicao` conectado ao Firestore com validação prévia de campos obrigatórios e itens mínimos.
* **Read (Ler):** Método `buscarRefeicoes` que recupera a lista do banco e a instancia utilizando o padrão de classes do projeto.
* **Update (Atualizar):** Método `atualizarRefeicao` que modifica a refeição existente pelo ID sem gerar registros duplicados.
* **Delete (Deletar):** Método `deletarRefeicao` para remoção síncrona e assíncrona do banco e atualização imediata do estado local da interface.
* **Validação de Cadastro:** Travas lógicas no formulário que exigem obrigatoriamente um nome de refeição válido e pelo menos um alimento adicionado antes de permitir o salvamento.

---

## 📱 Como Testar a Aplicação

1. **Configuração do Ambiente:**
   * Certifique-se de ter o Node.js e o Expo CLI instalados.
   * Instale as dependências executando: `npm install`
2. **Executando o Projeto:**
   * Inicie o servidor de desenvolvimento: `npx expo start`
   * Abra o aplicativo no seu dispositivo físico via aplicativo **Expo Go** ou em um emulador configurado.
3. **Validando os Fluxos:**
   * **Passo 1:** Na tela de *Plano Alimentar*, clique no botão de lixeira ao lado de uma refeição para testar a exclusão.
   * **Passo 2:** Clique em *Criar Nova Refeição*. Observe o ícone de lixeira no topo (desativado/transparente).
   * **Passo 3:** Tente salvar sem colocar nome ou alimentos para testar a trava de validação.
   * **Passo 4:** Adicione itens do catálogo ou crie um alimento personalizado no modal. Salve a refeição e confirme o sucesso integrado ao Firebase.
