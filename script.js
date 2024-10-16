$(document).ready(function() {
  var items = [];

  $("#item-form").on("submit", addItemToCard);
  $("#cart-table").on("click", ".btn-danger", removeItemFromCard);
  $("#generate-invoice").on("click", generateInvoice);

  function addItemToCard(event) {
    event.preventDefault();

    var itemName = $("#item-name").val();
    var itemPrice = $("#item-price").val();

    if (itemName !== "" && itemPrice !== "") {
      var item = {
        name: itemName,
        price: parseFloat(itemPrice),
      };

      items.push(item);
      $("#cart-table tbody").append(
        "<tr><td>" + item.name + "</td><td>$" + item.price.toFixed(2) + '</td><td><button class="btn btn-sm btn-danger"><i class="fa fa-trash-alt"></i></button></td></tr>'
      );

      updateTotalCost();
      $("#item-name").val("");
      $("#item-price").val("");
    }
  }

  function removeItemFromCard() {
    var index = $(this).closest("tr").index();
    items.splice(index, 1);
    $(this).closest("tr").remove();
    updateTotalCost();
  }

  function updateTotalCost() {
    var totalCost = 0;
    items.forEach(function(item) {
      totalCost += item.price;
    });
    $("#total-cost").text("Total Cost: ₵" + totalCost.toFixed(2));
  }

  function generateInvoice() {
    var invoiceHTML = `
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            width: 30%;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          p {
            text-align: right;
            font-weight: bold;
          }
          .button-container {
            text-align: center;
            margin-top: 20px;
          }
          .button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
          }
            @media screen and (max-width: 768px) {
    body {
      width: 90%;
    }
    table {
      font-size: 14px;
    }
  }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Item Price</th>
            </tr>
          </thead>
          <tbody>
          `;
  
    items.forEach(function(item) {
      invoiceHTML += "<tr><td>" + item.name + "</td><td>₵" + item.price.toFixed(2) + "</td></tr>";
    });
  
    invoiceHTML += `
          </tbody>
        </table>
        <p>Total Cost: ₵${getTotalCost()}</p>
        <div class="button-container">
          <button class="button" onclick="window.print()">Print</button>
          <button class="button" onclick="generatePDF()">Download as PDF</button>
        </div>
      </body>
      </html>`;
  
    var popup = window.open("", "_blank");
    popup.document.write(invoiceHTML);
    popup.document.close();
  }
  
  function generatePDF() {
    var doc = new jsPDF();
    doc.fromHTML(document.getElementById("invoice"), 15, 15, {
      width: 170
    });
    doc.save('invoice.pdf');
  }

  function getTotalCost() {
    var totalCost = 0;
    items.forEach(function(item) {
      totalCost += item.price;
    });
    return totalCost.toFixed(2);
  }
});