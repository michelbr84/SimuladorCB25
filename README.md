# 🇧🇷 Simulador do Campeonato Brasileiro Série A

Simulador interativo do **Campeonato Brasileiro Série A**, desenvolvido em **HTML, CSS e JavaScript puro**, permitindo simular **todas as 38 rodadas**, rodada a rodada, com **seed determinística** para resultados reproduzíveis.

O layout e a experiência visual são inspirados em **apps e portais esportivos profissionais**, com destaque por cores para **Libertadores, Pré-Libertadores, Sul-Americana, zona neutra e Rebaixamento**.

---

## ✨ Funcionalidades

### 🎮 Modo Carreira
- ⚽ **Escolha seu time** — Selecione o time que você vai acompanhar
- ⭐ **Destaque na tabela** — Seu time aparece destacado em dourado
- 🏆 **Conquistas** — Acompanhe títulos, Libertadores, Sul-Americana e rebaixamentos
- 📊 **Mensagens de fim de temporada** — Feedback personalizado baseado na posição final

### 📅 Simulação
- ✅ Simulação completa de **38 rodadas**
- 🎲 **Seed configurável** — Mesma seed = mesmos resultados
- ⏭️ Simular **rodada a rodada** ou **até o fim**
- 🔄 **Múltiplas temporadas** — Continue para 2026, 2027, etc.

### 🔁 Sistema de Promoção/Rebaixamento
- 📉 **Rebaixamento** — Últimos 4 times vão para a Série B
- 📈 **Promoção** — 4 times da Série B sobem para a Série A
- ⏸️ **Série B automática** — Se seu time for rebaixado, a temporada é simulada automaticamente

### 📊 Tabela Dinâmica
- Critérios oficiais: Pontos (P), Vitórias (V), Saldo de Gols (SG), Gols Pró (GP)
- 🎨 Classificação por cores:
  - 🔵 Libertadores (1–4)
  - 🟦 Pré-Libertadores (5–6)
  - 🟢 Sul-Americana (7–12)
  - ⚪ Zona neutra (13–16)
  - 🔴 Rebaixamento (17–20)

### 💻 Técnico
- 📱 Layout responsivo (desktop e mobile)
- ⚙️ 100% frontend (sem backend, sem dependências)
- 🔁 Reiniciar temporada a qualquer momento

---

## 🎮 Como jogar

1. **Escolha seu time** — Ao abrir, selecione o time que você quer acompanhar
2. **Defina uma Seed** (opcional) — Para resultados reproduzíveis
3. **Simule as rodadas** — Use "Próxima rodada" ou "Simular até o fim"
4. **Veja o resultado** — Ao final, receba feedback sobre a posição do seu time
5. **Avance para a próxima temporada** — Continue a carreira do seu time

---

## 🏆 Sistema de Conquistas

| Posição | Resultado | Registro |
|---------|-----------|----------|
| 1º | Campeão Brasileiro | +1 Título |
| 2º–4º | Classificado para Libertadores | +1 Libertadores |
| 5º–6º | Classificado para Pré-Libertadores | +1 Pré-Libertadores |
| 7º–12º | Classificado para Sul-Americana | +1 Sul-Americana |
| 17º–20º | Rebaixado para Série B | +1 Rebaixamento |

---

## 📁 Estrutura do Projeto

```text
/
├─ index.html    # Estrutura principal + modais
├─ styles.css    # Tema, layout, cores e modais
├─ script.js     # Lógica de simulação, seed, tabela, conquistas
└─ README.md     # Documentação do projeto
```

---

## 🚀 Como executar

### Opção 1 — Abrir direto no navegador

1. Baixe ou clone o repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno

### Opção 2 — Servidor local (opcional)

```bash
# usando Python
python -m http.server
```

Depois acesse: `http://localhost:8000`

---

## 🧠 Como funciona a simulação

### 🔢 Seed determinística
O simulador usa um **gerador de números pseudoaleatórios determinístico** baseado em:
- `xmur3` (hash da seed)
- `sfc32` (PRNG)

Isso garante que a mesma seed sempre gera a **mesma temporada**.

### ⚽ Geração de placares
- Distribuição realista de gols (0–4 mais comum, goleadas raras)
- Leve vantagem para o mandante
- Limite máximo de gols para manter plausibilidade

### 📅 Calendário
- 38 rodadas via **round-robin (circle method)**
- 19 rodadas (turno) + 19 rodadas (returno)

---

## 📌 Tecnologias usadas

- HTML5
- CSS3 (variables, gradients, responsive layout)
- JavaScript (ES6+)
- Nenhuma dependência externa

---

## 📄 Licença

Este projeto é livre para uso educacional, pessoal ou experimental.
Sinta-se à vontade para modificar, estender e adaptar.

---

⚽ **Divirta-se simulando o Brasileirão!**
