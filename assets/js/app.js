// VARIÁVEIS PARA O MODAL
let divTitle = document.getElementById("divTitle");
let modalTitle = document.getElementById("modalTitle");
let modalBody = document.getElementById("modal-body");
let modalButton = document.getElementById("modalButton");

let year = document.getElementById("year");
let month = document.getElementById("month");
let day = document.getElementById("day");
let type = document.getElementById("type");
let price = document.getElementById("price");

// ABSTRAÇÃO DA DESPESA
// 2°  CRIAÇÃO DE UMA CLASS
class Expense {
  //PARÂMETROS QUE SERÃO RECEBIDOS
  constructor(year, month, day, type, description, price) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.type = type;
    this.description = description;
    this.price = price;
  }
  // 4° VALIDAÇÃO DOS DADOS DENTRO DA PRÓPRIA CLASSE
  validate() {
    // PERCORRE OS ATRIBUTOS YEAR, MONTH, DAY .....
    // THIS.[I] RETORNA OS VALORES DOS RESPECTIVOS ATRIBUTOS (SEMELHANDO AO ARR)
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

//3°  CRIANDO CLASS BD
class Bd {
  // NA CONSTRUÇÃO SERÁ VERIFICADO SE EXISTE UM ID
  constructor() {
    let id = localStorage.getItem("id");

    // CASO NÃO EXISTA, SERÁ INSERIDO UM ID = 0
    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }
  // INSERIR +1 AO ID
  // É POSSÍVEL SIMPLIFICAR COM .LENGTH
  getNextId() {
    let nextId = localStorage.getItem("id");
    return parseInt(nextId) + 1;
  }

  // INSERIR NO LOCALSTORAGE WEB
  pinStorage(info) {
    // PEGAR PRÓXIMO ID
    let id = this.getNextId();

    // CONVERTER AS INFOS EM JSON
    localStorage.setItem(id, JSON.stringify(info));
    // SETTAR UM ID COMO IDENTIFICADOR
    localStorage.setItem("id", id);
  }

  // RECUPERAR TODOS OS DADOS DE STORAGE
  getAllStorage() {
    // ARR PARA AGREGAR TODAS AS DESPESAS

    let arrExpenses = Array();
    let id = localStorage.getItem("id");

    // CONTADOR PARA PERCORRER OS IDS
    for (let i = 1; i <= id; i++) {
      // RECUPERANDO OS DADOS
      // CONVERTER DE JSON PARA OBJ
      let listExpenses = JSON.parse(localStorage.getItem(i));

      // VALIDAR OS IDS
      if (listExpenses === null) {
        continue;
      }
      listExpenses.id = i;
      // ADICIONANDO AS DESPESAS DA STORAGE NO ARRAY
      arrExpenses.push(listExpenses);
    }
    // RETORNANDO O ARRAY PARA A FUNÇÃO LOADLISTEXPENSES
    return arrExpenses;
  }

  search(expense) {
    let expensesFilter = [];
    expensesFilter = this.getAllStorage();
    // console.log(expensesFilter);
    // console.log(expense);
    // NECESSÁRIO FAZER COM QUE A VARIÁVEL ATRIBUA O FILTRO PARA QUE SEJA ATUALIZADA E FUNCIONE CORRETAMENTE
    // ANO
    if (expense.year != "") {
      expensesFilter = expensesFilter.filter((e) => e.year == expense.year);
    }
    // MÊS
    if (expense.month != "") {
      expensesFilter = expensesFilter.filter((e) => e.month == expense.month);
    }
    // DAY
    if (expense.day != "") {
      expensesFilter = expensesFilter.filter((e) => e.day == expense.day);
    }

    // TIPO
    if (expense.type != "") {
      expensesFilter = expensesFilter.filter((e) => e.type == expense.type);
    }

    // DESCRIÇÃO
    if (expense.description != "") {
      expensesFilter = expensesFilter.filter(
        (e) => e.description == expense.description
      );
    }

    // PREÇO
    if (expense.price != "") {
      expensesFilter = expensesFilter.filter((e) => e.price == expense.price);
    }
    return expensesFilter;
  }
  delInfo(id) {
    localStorage.removeItem(id);
  }
}

//3°  INSTANCIANDO NOVO BD
let bd = new Bd();

//1 ° RESGATANDO AS INFORMAÇÕES
// FUNCTION ACIONADA COM O BUTTON
function registerInfo() {
  // 2° PARÂMETROS QUE SERÃO ENVIADOS
  let expense = new Expense(
    year.value,
    month.value,
    day.value,
    type.value,
    description.value,
    price.value
  );

  // 4° VALIDAÇÃO DOS CAMPOS PREENCHIDOS
  if (expense.validate()) {
    // DA INSTANCIA DE BD FOI INVOCADA O MÉTODO PINSTORAGE
    bd.pinStorage(expense);
    divTitle.className = "modal-header text-success";
    modalTitle.innerHTML = "Registrado com sucesso!";
    modalBody.innerHTML = "Sua despesa foi cadastrada com sucesso.";
    modalButton.className = "btn btn-success";
    modalButton.innerHTML = "Voltar";
    // JQUERY RESPONSÁVEL POR SELECIONAR O ID E MOSTRAR UM MODAL
    $("#dialogModal").modal("show");

    resetInfo();
  } else {
    // HTML
    divTitle.className = "modal-header text-danger";
    modalTitle.innerHTML = "Erro no cadastro";
    modalBody.innerHTML = "Preencha todos os campos obrigatórios!";
    modalButton.className = "btn btn-danger";
    modalButton.innerHTML = "Ok, vou corrigir!";
    // JQUERY RESPONSÁVEL POR SELECIONAR O ID E MOSTRAR UM MODAL
    $("#dialogModal").modal("show");
  }
}

function resetInfo() {
  year.value = "";
  month.value = "";
  day.value = "";
  type.value = "";
  description.value = "";
  price.value = "";
}

function loadListExpenses(expenses = Array(), filter = false) {
  if (expenses.length == 0 && filter == false) {
    // RECEBENDO O ARRAY DA FUNÇÃO GETALLSTORAGE ATRIBUINDO A UMA VÁRIAVEL
    expenses = bd.getAllStorage();
  }

  let consultList = document.getElementById("consultList");
  consultList.innerHTML = "";

  expenses.forEach(function (d) {
    // CRIANDO LINHA (TR)
    var row = consultList.insertRow();

    // CRIANDO COLUNA(TD)
    row.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}`;

    switch (d.type) {
      case "1":
        d.type = "Alimentação";
        break;
      case "2":
        d.type = "Educação";
        break;
      case "3":
        d.type = "Lazer";
        break;
      case "4":
        d.type = "Saúde";
        break;
      case "5":
        d.type = "Transporte";
    }

    row.insertCell(1).innerHTML = d.type;
    row.insertCell(2).innerHTML = d.description;
    row.insertCell(3).innerHTML = d.price;

    // BOTÃO DE EXCLUSÃO
    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    btn.id = `ID-da-despesa${d.id}`;

    btn.onclick = function () {
      let id = this.id.replace("ID-da-despesa", "");

      bd.delInfo(id);

      window.location.reload();
    };
    row.insertCell(4).append(btn);
  });
}

function searchExpenses() {
  let year = document.getElementById("year").value;
  let month = document.getElementById("month").value;
  let day = document.getElementById("day").value;
  let type = document.getElementById("type").value;
  let description = document.getElementById("description").value;
  let price = document.getElementById("price").value;

  let expense = new Expense(year, month, day, type, description, price);
  let expenses = bd.search(expense);

  loadListExpenses(expenses, true);
}
