\# 🇧🇷 Simulador do Campeonato Brasileiro Série A — Edição 2025



Simulador interativo do \*\*Campeonato Brasileiro Série A 2025\*\*, desenvolvido em \*\*HTML, CSS e JavaScript puro\*\*, permitindo simular \*\*todas as 38 rodadas\*\*, rodada a rodada, com \*\*seed determinística\*\* para resultados reproduzíveis.



O layout e a experiência visual são inspirados em \*\*apps e portais esportivos profissionais\*\*, com destaque por cores para \*\*Libertadores, Pré-Libertadores, Sul-Americana, zona neutra e Rebaixamento\*\*.



---



\## ✨ Funcionalidades



\- ✅ Simulação completa de \*\*38 rodadas\*\*

\- 🎲 \*\*Seed configurável pelo usuário\*\*

&nbsp; - Mesma seed → mesmos resultados

\- ⏭️ Simular \*\*rodada a rodada\*\* ou \*\*até o fim\*\*

\- 📊 Tabela dinâmica com critérios oficiais:

&nbsp; - Pontos (P)

&nbsp; - Vitórias (V)

&nbsp; - Saldo de gols (SG)

&nbsp; - Gols pró (GP)

\- 🎨 Classificação por cores:

&nbsp; - 🔵 Libertadores (1–4)

&nbsp; - 🟦 Pré-Libertadores (5–6)

&nbsp; - 🟢 Sul-Americana (7–12)

&nbsp; - ⚪ Zona neutra (13–16)

&nbsp; - 🔴 Rebaixamento (17–20)

\- 🔁 Reiniciar temporada a qualquer momento

\- 📱 Layout responsivo (desktop e mobile)

\- ⚙️ 100% frontend (sem backend, sem dependências)



---



\## 🧠 Como funciona a simulação



\### 🔢 Seed determinística

O simulador usa um \*\*gerador de números pseudoaleatórios determinístico\*\*, baseado em:



\- `xmur3` (hash da seed)

\- `sfc32` (PRNG)



Isso garante que:

\- A mesma seed sempre gera a \*\*mesma temporada\*\*

\- É possível compartilhar resultados apenas compartilhando a seed



\### ⚽ Geração de placares

\- Distribuição realista de gols (0–4 mais comum, goleadas raras)

\- Leve vantagem para o mandante

\- Limite máximo de gols para manter plausibilidade



\### 📅 Calendário

\- Calendário completo de \*\*38 rodadas\*\*

\- Gerado automaticamente via \*\*round-robin (circle method)\*\*:

&nbsp; - 19 rodadas (turno)

&nbsp; - 19 rodadas (returno)

\- Estrutura pronta para substituir por \*\*fixture oficial real\*\*, se desejado



---



\## 📁 Estrutura do Projeto



```text

/

├─ index.html    # Estrutura principal do app

├─ styles.css    # Tema, layout e cores da classificação

├─ script.js     # Lógica de simulação, seed, tabela e rodadas

└─ README.md     # Documentação do projeto

````



---



\## 🚀 Como executar



\### Opção 1 — Abrir direto no navegador



1\. Baixe ou clone o repositório

2\. Abra o arquivo `index.html` em qualquer navegador moderno



\### Opção 2 — Servidor local (opcional)



```bash

\# usando Python

python -m http.server

```



Depois acesse:



```

http://localhost:8000

```



---



\## 🎮 Como usar



1\. (Opcional) Digite uma \*\*Seed\*\*

&nbsp;  Exemplo:



&nbsp;  ```

&nbsp;  brasileirao-2025

&nbsp;  ```

2\. Clique em \*\*Aplicar\*\*

3\. Use:



&nbsp;  \* \*\*Próxima rodada\*\* → simula 1 rodada

&nbsp;  \* \*\*Simular até o fim\*\* → simula as 38 rodadas

4\. Navegue entre rodadas usando as setas

5\. Veja a tabela atualizar automaticamente



---



\## 🎨 Sistema de cores da tabela



| Zona             | Posição | Cor      |

| ---------------- | ------- | -------- |

| Libertadores     | 1–4     | Azul     |

| Pré-Libertadores | 5–6     | Ciano    |

| Sul-Americana    | 7–12    | Verde    |

| Zona Neutra      | 13–16   | Cinza    |

| Rebaixamento     | 17–20   | Vermelho |



Cada zona possui:



\* Barra lateral colorida

\* Número da posição colorido

\* Degradê sutil no fundo da linha



---



\## 🛠️ Customizações possíveis



\* 🔁 Substituir o calendário gerado por \*\*fixture oficial\*\*

\* ⚖️ Adicionar \*\*força dos times\*\* (rating ofensivo/defensivo)

\* 📈 Estatísticas extras:



&nbsp; \* Aproveitamento

&nbsp; \* Últimos 5 jogos

&nbsp; \* Melhor ataque/defesa

\* 💾 Persistência com `localStorage`

\* ✏️ Edição manual de placares

\* 🏆 Destaque automático de campeão e rebaixados



---



\## 📌 Tecnologias usadas



\* HTML5

\* CSS3 (variables, gradients, responsive layout)

\* JavaScript (ES6+)

\* Nenhuma dependência externa



---



\## 📄 Licença



Este projeto é livre para uso educacional, pessoal ou experimental.

Sinta-se à vontade para modificar, estender e adaptar.



---



\## 🤝 Contribuições



Sugestões e melhorias são bem-vindas.

Ideias comuns:



\* Fixture oficial real

\* Exportar resultados (CSV / JSON)

\* Modo “meu time”

\* Simulação Monte Carlo (mil temporadas)



---



⚽ \*\*Divirta-se simulando o Brasileirão 2025!\*\*

