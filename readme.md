
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

### **Respostas**

#### Sucesso:
- **Status Code:** `200 OK`
```json
{
  "status": 200,
  "success": true,
  "message": "Colaborador cadastrado com sucesso!"
}
```

#### Erro:
- **Status Code:** `500 Internal Server Error`
```json
{
  "status": 500,
  "success": false,
  "message": "Erro ao cadastrar colaborador.",
  "error": "Descrição detalhada do erro"
}
```

---

## **2. Endpoints de Dados Selecionáveis**

### **Descrição Geral**
Endpoints para popular campos de seleção no front-end.

---

### **2.1. Empresas**
- **Endpoint:** `/getEmpresas`
- **Descrição:** Retorna uma lista de empresas.
- **Método:** `GET`
- **Resposta de Sucesso:**
```json
{
  "status": 200,
  "success": true,
  "message": "Empresas obtidas com sucesso.",
  "data": [
    { "id": 1, "text": "Empresa A" },
    { "id": 2, "text": "Empresa B" }
  ]
}
```

---

### **2.2. Regimes**
- **Endpoint:** `/getRegimes`
- **Descrição:** Retorna os regimes de contratação disponíveis.
- **Método:** `GET`
- **Resposta de Sucesso:**
```json
{
  "status": 200,
  "success": true,
  "message": "Regimes obtidos com sucesso.",
  "data": [
    { "id": 1, "text": "CLT" },
    { "id": 2, "text": "PJ" }
  ]
}
```

---

### **2.3. Cargos**
- **Endpoint:** `/getCargos`
- **Descrição:** Retorna a lista de cargos disponíveis.
- **Método:** `GET`
- **Resposta de Sucesso:**
```json
{
  "status": 200,
  "success": true,
  "message": "Cargos obtidos com sucesso.",
  "data": [
    { "id": 1, "text": "Desenvolvedor" },
    { "id": 2, "text": "Analista" }
  ]
}
```

---

### **2.4. Setores**
- **Endpoint:** `/getSetores`
- **Descrição:** Retorna os setores disponíveis.
- **Método:** `GET`
- **Resposta de Sucesso:**
```json
{
  "status": 200,
  "success": true,
  "message": "Setores obtidos com sucesso.",
  "data": [
    { "id": 1, "text": "TI" },
    { "id": 2, "text": "RH" }
  ]
}
```

---

## **3. Endpoints para Localidades**

### **3.1. Estados**
- **Endpoint:** `/getEstados`
- **Descrição:** Retorna uma lista de estados brasileiros.
- **Método:** `GET`
- **Resposta de Sucesso:**
```json
{
  "status": 200,
  "success": true,
  "message": "Estados obtidos com sucesso.",
  "data": [
    { "id": 12, "text": "Acre" },
    { "id": 27, "text": "Alagoas" }
  ]
}
```

---

### **3.2. Cidades**
- **Endpoint:** `/getCidades/:estadoId`
- **Descrição:** Retorna as cidades de um estado.
- **Método:** `GET`
- **Parâmetros:**
  - `estadoId` - ID do estado.
- **Resposta de Sucesso:**
```json
{
  "status": 200,
  "success": true,
  "message": "Cidades obtidas com sucesso.",
  "data": [
    { "id": 12345, "text": "São Paulo" },
    { "id": 67890, "text": "Campinas" }
  ]
}
```

---

## **Observações e Boas Práticas**

1. **População Dinâmica de Dropdowns:**
   - Utilize os endpoints de seleção (`/getEmpresas`, `/getCargos`, etc.) diretamente com as configurações do `select2` para dropdowns.

2. **Validação no Front-End:**
   - Certifique-se de validar todos os campos obrigatórios antes de enviar dados para o back-end.

3. **Tratamento de Erros:**
   - Utilize os campos de mensagem e status nas respostas para exibir mensagens claras para o usuário.

4. **Referências de UI:**
   - Baseie o front-end nos padrões sugeridos, como os do template [Sneat Admin Template](https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/).

---
