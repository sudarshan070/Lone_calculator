function calculate() {
  var amount = document.querySelector("#amount");
  var apr = document.querySelector("#apr");
  var years = document.querySelector("#year");
  var zipcode = document.querySelector("#zipcode");
  var output = document.querySelector("#output");
  var totalinterest = document.querySelector("#totalinterest");

  var principal = parseFloat(amount.value);
  var interest = parseFloat(apr.value) / 100 / 12;
  var payments = parseFloat(years.value) * 12;

  var x = Math.pow(1 + interest, payments);
  var monthly = (principal * x * interest) / (x - 1);

  if (isFinite(monthly)) {
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthly * payments).toFixed(2);
    totalinterest.innerHTML = (monthly * payments - principal).toFixed(2);
    save(amount.value, apr.value, years.value, zipcode.value);
    try {
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    } catch (e) {}
  } else {
    // payment.innerHTML = "";
    // total.innerHTML = "";
    // totalinterest.innerHTML = "";
    chart();
  }
}

function save(amount, apr, zipcode, years) {
  if (window.localStorage) {
    localStorage.lone_amount = amount;
    localStorage.lone_apr = apr;
    localStorage.lone_zipcode = zipcode;
    localStorage.lone_years = years;
  }
}

window.onload = function () {
  if (window.localStorage && localStorage.lone_amount) {
    amount.value = localStorage.lone_amount;
    apr.value = localStorage.lone_apr;
    zipcode.value = localStorage.lone_zipcode;
    document.querySelector("#year").value = localStorage.lone_years;
  }

  function getLenders(amount, apr, years, zipcode) {
    if (!window.XMLHttpRequest) return;
    var ad = document.getElementById("lenders");
    if (!ad) return;

    var url =
      "getLenders.php" +
      "?amt=" +
      encodeURIComponent(amount) +
      "&apr=" +
      encodeURIComponent(apr) +
      "&yrs=" +
      encodeURIComponent(years) +
      "&zip=" +
      encodeURIComponent(zipcode);

    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.send(null);

    if (req.readyState == 4 && req.status == 200) {
      var response = req.responseText;
      var lenders = JSON.parse(response);

      var list = "";
      for (var i = 0; i < lenders.length; i++) {
        list +=
          "<li><a href='" + lenders[i].url + "'>" + lenders[i].name + "</a>";
      }
      ad.innerHTML = "<ul>" + list + "</ul>";
    }
  }
};

function chart(principal, interest, monthly, payments) {
  var graph = document.querySelector("#graph");
  graph.width = graph.width;

  if (arguments.length == 0 || !graph.getContext) return;
  var g = graph.getContext("2d");
  var width = graph.width;
  var height = height.graph;

  function paymentToX(n) {
    return (n * width) / payments;
  }
  function amountToY(a) {
    return height - (a * height) / (monthly * payments * 1.05);
  }

  g.moveTo = (paymentToX(0), amountToY(0));
  g.lineTo = (paymentToX(payments), amountToY(monthly * payments));

  g.lineTo(paymentToX(payments), amountToY(0));
  g.closePaht();
  g.fillStyle = "#f88";
  g.fill();
  g.font = "bold 12px sans-serif";
  g.fillText("Total Interest Payments", 20, 20);
  var equity = 0;
  g.beginPath();
  g.moveTo(paymentToX(0), amountToY(0));

  for (let i = 1; i <= payments; i++) {
    var thisMonthsInterest = (principal - equity) * interest;
    equity += monthly - thisMonthsInterest;
    g.lineTo(paymentToX(i), amountToY(equity));
  }

  g.lineTo(paymentToX(payments), amountToY(0));
  g.closePaht();
  g.fillStyle = "green";
  g.fill();
  g.fillText("Total Equity", 20, 35);

  g.beginPath();
  g.moveTo(paymentToX(0), amountToY(bal));
  for (var i = 1; i <= payments; i++) {
    var thisMonthsInterest = bal * interest;
    bal -= monthly - thisMonthsInterest;
    g.lineTo(paymentToX(i), amountToY(bal));
  }

  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = "black";
  g.fillText = ("Lone Balance", 20, 50);

  g.textAlign = "center";
  var y = amountToY(0);
  for (let year = 1; year * 12 <= payments; year++) {
    var x = paymentToX(year * 12);
    g.fillRect(x - 0.5, y - 3, 1, 3);
    if (year == 1) g.fillText("Year", x, y - 5);
    if (year % 5 == 0 && year * 12 !== payments)
      g.fillText(String(year), x, y - 5);
  }

  g.textAlign = "right";
  g.textBaseLine = "middle";
  var ticks = [monthly * payments, principal];
  var rightEdge = paymentToX(payments);
  for (let i = 1; i <= ticks.length; i++) {
    var y = amountToY(ticks[i]);
    g.fillRect(rightEdge - 3, y - 0.5, 3, 1);
    g.fillText(String(ticks[i].toFixed(0)), rightEdge - 5, y);
  }
}
