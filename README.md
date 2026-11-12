# VAGGO — Conectando você ao profissional ideal

Protótipo acadêmico (Engenharia de Software · UniAnchieta · POO + Professional English).
Plataforma que conecta profissionais de serviços domésticos a contratantes.

## Como abrir

Dê dois cliques em `index.html`. Não precisa instalar nada nem de servidor.

Contas de demonstração (senha `demo1234`):

| Perfil        | E-mail               |
|---------------|----------------------|
| Profissional  | maria@vaggo.demo     |
| Contratante   | andrade@vaggo.demo   |

No modal "Entrar" há botões que entram direto nessas contas. O botão PT/EN no topo troca o idioma e o botão de lua/sol troca entre tema claro e escuro.
Os dados ficam no `localStorage` do navegador; o rodapé tem "Restaurar dados de demonstração".
Todas as pessoas e vagas que vêm no app são fictícias.

## Estrutura

```
index.html
css/style.css
js/
  core/      errors.js · enums.js · I18n.js · Theme.js · ServiceGuide.js
  models/    User (abstrata) · Professional · Employer · Job · Application
  services/  Storage (StorageAdapter, Repository) · MatchScore · SeedData · VaggoPlatform
  ui/        UI · Motion · Dropdown · Portrait · Corridor (topo em 3D) · View (abstrata) · HomeView · ListViews · DashboardView · ProjectView · Dialogs · App
assets/      logos, fontes, vídeo e retratos (assets/people)
video/       código-fonte Remotion da animação do topo
```

## POO no código

| Conceito        | Onde ver |
|-----------------|----------|
| Encapsulamento  | Campos privados `#` em todas as classes; `User.checkPassword()`; `Application.accept()/reject()/withdraw()` |
| Herança         | `Professional` e `Employer` estendem `User`; `JobsView` e `ProfessionalsView` estendem `SearchView` |
| Abstração       | `User`, `View`, `SearchView`, `Panel` e `StorageAdapter` não podem ser instanciadas (`new.target`) |
| Polimorfismo    | `user.canApply()`, `user.describe()`, `view.render()`, `panel.render()`, `storage.read()/write()` |

A tela **O Projeto** (`#projeto`) apresenta os itens da Project Proposal: integrantes, nome/logo,
inovação proposta, funcionalidades e conceitos de POO, com diagrama de classes e a
equivalência Java ↔ JavaScript.

## Inovação proposta

Nota de compatibilidade (0–100) entre profissional e vaga, sempre explicada:
serviço (50) + cidade (30) + tipo de contrato (20). Veja `js/services/MatchScore.js`.

## Créditos

Os retratos das pessoas de demonstração são da coleção Open Peeps, de Pablo Stanley (licença CC0),
gerados com a biblioteca DiceBear. As fontes são Outfit e DM Sans (SIL Open Font License).
