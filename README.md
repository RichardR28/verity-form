Para rodar o projeto é necessário usar os comandos:


1. Terminal 01: npm i
2. Terminal 01: npm run dev
3. Terminal 02: npm run mock

Para rodar os testes unitários usar o comando abaixo:

- npm run test

Referente aos critérios avaliados:

- Para buscar o CEP foi usado uma api terceira, pois a dos correios necessitava um cadastro para a liberação. A diferença dessa API, é que a mesma não fornece o número, mas supre a necessidade de consultar, tratar e preencher os campos automaticamente. Informações da API abaixo:
1. API: ViaCEP 
2. Site: https://viacep.com.br/

Referente à gestão de dados entre as telas, achei mais vantajoso manter o render dos elementos ao invés de remonta-los sem necessidade, mas para suprie a avaliação foi usado gestão de dados globalmente via Zustand (stores). 
