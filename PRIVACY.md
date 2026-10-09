# Política de Privacidade — Malditos Goblins Bot

Última atualização: 2026-10-08

Este bot foi feito para gerar personagens e rolar dados do RPG Malditos Goblins dentro do Discord. Esta política
explica, de forma direta, o que acontece com os dados de quem usa o bot.

## Resumo

**O bot não armazena nenhum dado.** Cada comando é processado, respondido, e esquecido. Não existe banco de dados,
cache ou qualquer outro armazenamento persistente por trás deste bot — isso é uma decisão de arquitetura, não só
uma política (veja a seção "Como isso funciona na prática").

## Quais dados o bot recebe

Quando você usa um comando (como `/goblin criar`), o Discord envia ao bot uma requisição contendo:

- O comando usado e os valores que você preencheu (ex.: o nome escolhido para o goblin, a quantidade de dados).
- Seu ID de usuário do Discord (necessário para marcar "`@você` criou o seguinte goblin" na resposta).
- O ID do servidor e do canal onde o comando foi usado.

Essas informações vêm diretamente do Discord como parte do protocolo de interações de bots, e não de qualquer
rastreamento feito por este projeto.

## O que é feito com esses dados

Os dados recebidos são usados exclusivamente para calcular e montar a resposta do comando (rolar os dados, montar a
ficha do goblin, etc.) e então são descartados. Nada é salvo em disco, banco de dados ou qualquer outro lugar
controlado por este projeto.

## Como isso funciona na prática

O bot roda como um [Cloudflare Worker](https://workers.cloudflare.com/): cada comando chega como uma requisição
HTTP, é processado e respondido, e a execução termina — sem processo contínuo, sem conexão salva, sem banco de dados
conectado. O arquivo de configuração do Worker (`wrangler.toml`) não declara nenhum armazenamento (KV, D1, etc.), o
que é a confirmação técnica de que não há onde os dados poderiam ficar guardados.

## Serviços de terceiros envolvidos

- **Discord**: recebe e processa toda a interação (é quem te envia o resultado do comando). O uso do Discord é
  regido pela [Política de Privacidade do Discord](https://discord.com/privacy).
- **Cloudflare**: hospeda o bot. Como provedor de infraestrutura, a Cloudflare pode manter registros técnicos de
  requisições (como qualquer provedor de hospedagem) conforme a
  [Política de Privacidade da Cloudflare](https://www.cloudflare.com/privacypolicy/) — esses registros não são
  acessados, armazenados ou usados por este projeto.
- **GitHub**: as imagens das ocupações (ex.: o ícone do Bruxo, do Caçador) são carregadas diretamente de um
  repositório público no GitHub quando o Discord renderiza a mensagem. Isso significa que o GitHub pode registrar
  essa requisição como qualquer acesso a um arquivo público, conforme a
  [Política de Privacidade do GitHub](https://docs.github.com/pt/site-policy/privacy-policies/github-privacy-statement).

Nenhum outro serviço externo é contatado por este bot.

## Cookies e rastreamento

Este bot não usa cookies, pixels de rastreamento, analytics ou qualquer tecnologia de rastreamento de usuários.

## Crianças

Este bot não coleta intencionalmente dados de crianças. Como nenhum dado é armazenado de ninguém, isso vale
igualmente para usuários de qualquer idade.

## Seus direitos

Como nenhum dado pessoal é armazenado, não há dados para solicitar acesso, correção ou exclusão — cada execução do
bot já não deixa rastro algum da sua parte. Dúvidas sobre o uso do Discord em si devem ser direcionadas ao próprio
Discord.

## Alterações nesta política

Se a forma como o bot funciona mudar de um jeito que afete esta política (por exemplo, se um recurso futuro passar a
guardar algum dado), este arquivo será atualizado e a data no topo será revisada.

## Contato

Dúvidas sobre esta política ou sobre o bot podem ser enviadas para antomarsi@hotmail.com ou abertas como uma
[issue no GitHub](https://github.com/antomarsi/malditos-goblins-discordjs/issues).
