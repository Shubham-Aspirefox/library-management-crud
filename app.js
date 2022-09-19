$(function () {
  function displayCards(data) {
    $("#showAlert").hide();

    data.forEach((element) => {
      let cards = [];
      cards.push(element.imgUrl);
      cards.push(element.Name);
      cards.push(element.Author);
      cards.push(element.Category);
      cards.push(element.Rating);
      cards.push(element.QuantityAvailable);

      $("#bookCard").append(
        `<div class="card" id="fullCard" style="width: 12.5rem;">
          <img src="${element.imgUrl}" class="card-img-top" alt="No Image" height="250" width="100"/>
          <div class="card-body" id="cardBody">
            <h5 class="card-title">${element.Name}</h5>
            <hr>
            <p class="card-text">
                <p>Author: ${element.Author}</p>
                <p>Genre:  ${element.Category}</p>
                <p>Rating: ${element.Rating}</p>
                <p>Price: ${element.Price}</p>
                <p class="changeCount" >Quantity: ${element.QuantityAvailable} </p>
            </p>
            
          </div>
        </div>`
      );
    });
  }

  function showAlert(message) {
    
    $("#showAlert strong").text(message);

    $("#showAlert").show();

    setTimeout(() => {
        $("#showAlert").hide("slow");
    }, 5000);

    
   
  }

  function booksDropdown(data) {
    let price = [];

    data.forEach((element) => {
      price[element.Name] = element.Price;
      $(".booksDropdown").append(
        `<option value="${element.Name}">${element.Name}</option>`
      );
    });

    let bookName;
    $(".booksDropdown").change(function () {
      bookName = $(".booksDropdown").val();
      let currentPrice = price[bookName];
      $(".totalPrice").val(currentPrice);
    });
    $("#addNewBooks").change(function () {
      newBookName = $("#addNewBooks").val();
      let currentPrice = price[newBookName];
      $("#addTotalPrice").val(currentPrice);
    });
    $("#removeNewBooks").change(function () {
      let temp = $("#removeNewBooks").val();
      let tempPrice = price[temp];
      $("#subtractTotalPrice").val(tempPrice);
    });
    return bookName;
  }



  function addNewBorrower() {
    let userDataLocal = JSON.parse(localStorage.getItem("user"));
    let keys = ["Name", "Phone", "DOB", "TotalPrice", "Address", "Id"];

    let lastId = userDataLocal[userDataLocal.length - 1]["Id"];
    lastId++;

    $("#addBtn").click(function () {
      let inputNode = $("#formID input.fields");
      let fields = [];
      //stores the key value pair
      for (let i = 0; i < inputNode.length; i++) {
        if ($(inputNode[i]).val() == "") {
          return;
        }
        // fields.push($(inputNode[i]).val());
        fields[keys[i]] = $(inputNode[i]).val();
      }

      //create a tr and then append td to it
      let values = Object.values(fields);
      let tr = $(`<tr></tr>`);

      values.forEach((element) => {
        let td = $(`<td></td>`);
        td.text(element);
        tr.append(td);
      });

      let tdAction = $(`<td>
          <button class="btn btn-primary actionBtn" data-bs-toggle="modal" data-bs-target="#removeNew">Return</button>
          <button class="btn btn-primary actionBtn" data-bs-toggle="modal" data-bs-target="#addNew">ADD NEW</button>
        </td>`);
      tr.append(tdAction);

      $("#tbody").append(tr);

      fields[keys[keys.length - 1]] = lastId;

      let userDataObj = Object.assign({}, fields);
      userDataLocal.push(userDataObj);

      addUserLocal(userDataLocal);
    });
  }



  function createTable() {
    $("#bigModal").click(function () {
      $("#formId").trigger("reset");

      // addNewBorrower();
    });
    //creating the table from local storage
    addNewBorrower();

    let userLocal = JSON.parse(localStorage.getItem("user"));

    if (userLocal == null) {
      return;
    }

    let row = userLocal.length;
    let col = userLocal[0].length; //todo -1

    for (let i = 0; i < row; i++) {
      let tr = $(`<tr></tr>`);
      let localValues = Object.values(userLocal[i]);

      for (let j = 0; j < localValues.length; j++) {
        let td = $(`<td></td>`);
        td.text(localValues[j]);

        tr.append(td);
      }
      let tdAction = $(`<td>
          <button class="btn btn-primary actionBtn removeBtn" data-bs-toggle="modal" data-bs-target="#removeNew">Return</button>
          <button class="btn btn-primary actionBtn" data-bs-toggle="modal" data-bs-target="#addNew">ADD NEW</button>
        </td>`);
      tr.append(tdAction);
      $("#tbody").append(tr);
    }

    applyDatatables();
  }



  function updatePriceLocal(price, id) {
    let userDataLocal = JSON.parse(localStorage.getItem("user"));

    for (let i = 0; i < userDataLocal.length; i++) {
      if (userDataLocal[i]["Id"] == id) {
        userDataLocal[i]["TotalPrice"] = price;
      }
    }
    addUserLocal(userDataLocal);
  }


  function applyDatatables() {
    $("#tableId").DataTable({
      order: [[5, "desc"]],
    });

    $("#formID").validate({
      rules: {
        Name: {
          required: true,
        },
        Phone: {
          required: true,
        },
        DOB: {
          required: true,
        },
        Address: {
          required: true,
        },

        action: "required",
      },
      messages: {
        Name: {
          required: "Name is required",
        },
        Phone: {
          required: "Phone is required",
        },
        DOB: {
          required: "DOB is required",
        },
        Address: {
          required: "Address is required",
        },
      },
    });
  }

  function changeBookCount(bookName, state) {
    let localData = JSON.parse(localStorage.getItem("books"));
    let bookId;
    let amount;
    for (let i = 0; i < localData.length; i++) {
      if (localData[i]["Name"] == bookName) {
        amount = parseInt(localData[i]["QuantityAvailable"]);

        if (state == "reduce" && amount >= 0) {
          --amount;
        } else if (state == "increase" && amount < 10) {
          ++amount;
        }

        localData[i]["QuantityAvailable"] = amount;
        bookId = localData[i]["bookId"];
        // break;
      }
    }
    addToLocalBooks(localData);

    $($(".changeCount")[bookId - 1]).text("Quantity: " + amount);
    return amount;
  }

  function addNewBook() {
    let initialPrice;
    let totalPrice;
    let id;
    let tablePrice;

    $(".actionBtn").click(function () {
      let parent = $(this).parent();
      let sibiling = $(parent).siblings();
      tablePrice = $(sibiling[3]);
      id = $(sibiling[5]).text();
      initialPrice = $(sibiling[3]).text();
    });


    $("#addNewBtn").click(function () {
      let bookName = $("#addNewBooks").val();

      let amount = changeBookCount(bookName, "reduce");

      let temp = $("#addTotalPrice").val();
      totalPrice = parseInt(initialPrice) + parseInt(temp);
      $(tablePrice).text(totalPrice);

      updatePriceLocal(totalPrice, id);
      showAlert(`${bookName} Added. Quantity reduced to ${amount}`);
    });
  }

  function removeBook() {
    let initialPrice;
    let id;
    let tablePrice;
    let totalPrice;
    $(".removeBtn").click(function () {
      let parent = $(this).parent();
      let sibiling = $(parent).siblings();
      tablePrice = $(sibiling[3]);
      id = $(sibiling[5]).text();
      initialPrice = $(sibiling[3]).text();

      let editVal = $("#subtractTotalPrice").val();
      // console.log(editVal);
    });

    $("#removeBtn").click(function () {
      let bookName = $("#removeNewBooks").val();

      let amount = changeBookCount(bookName, "increase");

      let temp = $("#subtractTotalPrice").val();
      totalPrice = parseInt(initialPrice) - parseInt(temp);
      $(tablePrice).text(totalPrice);
      updatePriceLocal(totalPrice, id);
      showAlert(`${bookName} returned. Quantity increased to ${amount}`);
    });
  }

  //adds borrower to local data with new key
  function addUserLocal(data) {
    localStorage.setItem("user", JSON.stringify(data));
    let userLocal = JSON.parse(localStorage.getItem("user"));

    return userLocal;
  }

  function addToLocalBooks(data) {
    localStorage.setItem("books", JSON.stringify(data));
    let localData = JSON.parse(localStorage.getItem("books"));
    return localData;
  }

  function readBooks() {
    $.getJSON("books.json", function (data) {
      if (localStorage.getItem("books") == null) {
        localStorage.setItem("books", JSON.stringify(data));
      }
      let localData = JSON.parse(localStorage.getItem("books"));

      if (localStorage.getItem("user") == null) {
        let temp = {
          Name: "Demo",
          Phone: "01234567890",
          DOB: 23,
          TotalPrice: "0",
          Address: "Address 1",
          Id: 0

        };
        let temp1 = [];
        temp1.push(temp);

        localStorage.setItem("user", JSON.stringify(temp1));
      }

      displayCards(localData);
      

      //create dropdown in the modal
      let bookName = booksDropdown(localData);

      createTable();

      addNewBook();
      removeBook();
    });
  }
  

  readBooks();
});
