function calculate() {
  var amount = document.querySelector("#amount");
  var apr = document.querySelector("#apr");
  var year = document.querySelector("#year");
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
    payment.innerHTML = "";
    total.innerHTML = "";
    totalinterest.innerHTML = "";
    char();
  }
}
