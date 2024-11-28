
# Documentação da API - Cadastro de Colaborador

## **1. Endpoint: `/novo-colaborador`**

### **Descrição**
Cadastra um novo colaborador no sistema, incluindo informações pessoais, endereço, contatos de emergência e dados do usuário.

### **Método**
`POST`

### **Headers**
- `Content-Type: application/json`

### **Corpo da Requisição**

```json
{
  "nome": "João Silva",
  "data_admissao": "2024-01-01",
  "cpf": "12345678901",
  "rg": "1234567",
  "nome_mae": "Maria Silva",
  "nome_pai": "José Silva",
  "cidade_nascimento": "São Paulo",
  "estado_nascimento": "SP",
  "escolaridade": "Ensino Médio",
  "genero": "Masculino",
  "data_nascimento": "1990-05-15",
  "regime": "CLT",
  "telefone": "11987654321",
  "email": "joao.silva@email.com",
  "empresa": 1,
  "setor": 3,
  "rua": "Rua das Flores",
  "numero": "123",
  "complemento": "Apto 45",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01001000",
  "cnpj": "12345678000100",
  "observacoes": "Novo colaborador contratado.",
  "contatosEmergencia": [
    {
      "nome": "Maria Silva",
      "parentesco": "Mãe",
      "telefone": "11987654321"
    },
    {
      "nome": "José Silva",
      "parentesco": "Pai",
      "telefone": "11998765432"
    }
  ],
  "usuario_precifica": "joaosilva",
  "imagem_Url": "https://meusite.com/imagens/joao.jpg"
}
```

### **Resposta**

#### Sucesso:
- **Status Code:** `200 OK`
```json
{
  "success": true,
  "message": "Colaborador cadastrado com sucesso!"
}
```

#### Erro:
- **Status Code:** `500 Internal Server Error`
```json
{
  "error": "Erro ao cadastrar colaborador."
}
```

---

## **2. Endpoints para Select2**

### **2.1. Empresas**
- **Endpoint:** `/getEmpresas`
- **Descrição:** Carrega a lista de empresas disponíveis.
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 1, "text": "Empresa A" },
  { "id": 2, "text": "Empresa B" }
]
```

### **2.2. Regimes**
- **Endpoint:** `/getRegimes`
- **Descrição:** Lista os regimes de contratação disponíveis.
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 1, "text": "CLT" },
  { "id": 2, "text": "PJ" }
]
```

### **2.3. Cargos**
- **Endpoint:** `/getCargos`
- **Descrição:** Lista os cargos disponíveis.
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 1, "text": "Desenvolvedor" },
  { "id": 2, "text": "Analista" }
]
```

### **2.4. Setores**
- **Endpoint:** `/getSetores`
- **Descrição:** Lista os setores disponíveis.
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 1, "text": "TI" },
  { "id": 2, "text": "RH" }
]
```

### **2.5. Funções**
- **Endpoint:** `/getFuncoes`
- **Descrição:** Lista as funções disponíveis.
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 1, "text": "Programador" },
  { "id": 2, "text": "Designer" }
]
```

### **2.6. Grau de Parentesco**
- **Endpoint:** `/getGrauParentesco`
- **Descrição:** Lista os graus de parentesco para contatos de emergência.
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 1, "text": "Mãe" },
  { "id": 2, "text": "Pai" }
]
```

---

## **3. Endpoints para Estados e Cidades**

### **3.1. Estados**
- **Endpoint:** `/getEstados`
- **Descrição:** Retorna uma lista de estados (usando a API do IBGE).
- **Método:** `GET`
- **Resposta:**
```json
[
  { "id": 12, "text": "Acre" },
  { "id": 27, "text": "Alagoas" }
]
```

### **3.2. Cidades**
- **Endpoint:** `/getCidades/:estadoId`
- **Descrição:** Retorna as cidades de um estado específico.
- **Método:** `GET`
- **Parâmetro:**
  - `estadoId` - ID do estado.
- **Resposta:**
```json
[
  { "id": 12345, "text": "São Paulo" },
  { "id": 67890, "text": "Campinas" }
]
```

---

### Observações:

1. **Front-End:**
   - Utilize os endpoints de select (`/getEmpresas`, `/getCargos`, etc.) para popular os campos dropdown.
   - Nós utilizamos a referência em https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/

2. **Validação:**
   - Valide os campos obrigatórios antes de enviar a requisição para evitar erros.

3. **Depuração:**
   - Caso algum endpoint retorne erro, verifique os logs do servidor para exibir o detalhe do erro.

4. **Estrutura:**
   - Configure as opções de `select2` para buscar diretamente dos endpoints com o formato esperado (`id` e `text`).
  
4. **Funcionalidade:**
   - Configure a ação de um botão Enviar, para realizar a chamada da api /funcionarios/novo_colaborador realizando o envio de um arquivo json conforme documentado acima.
  