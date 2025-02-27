// Hardware data
const hardware = [
  { name: "Dobbelt Screen", cost: 3800, purchasingPrice: 8000, quantity: 0 },
  { name: "Single Screen", cost: 3400, purchasingPrice: 6500, quantity: 0 },
  { name: "M20", cost: 1400, purchasingPrice: 2500, quantity: 0 },
  { name: "Pengeskuffe", cost: 300, purchasingPrice: 1000, quantity: 0 },
];
  
  // Calculate prices
  const calculatePrices = (purchasingPrice, discount) => {
  const discountedPurchasing = purchasingPrice * (1 - discount / 100);
  const financing = purchasingPrice * 1.35;
  return {
    purchasing: purchasingPrice.toFixed(2),
    discountedPurchasing: discountedPurchasing.toFixed(2),
    financing: financing.toFixed(2),
  };
};
  
  // Populate table
  hardware.forEach((device, index) => {
  const row = document.createElement("tr");
  const prices = calculatePrices(device.purchasingPrice, device.discount);

  row.innerHTML = `
    <td>${device.name}</td>
    <td>$${device.cost.toFixed(2)}</td>
    <td id="purchasing-${index}">$${prices.purchasing}</td>
    <td id="financing-${index}">$${prices.financing}</td>
    <td>
      <button onclick="updateQuantity(${index}, -1)">-</button>
      <span id="quantity-${index}">0</span>
      <button onclick="updateQuantity(${index}, 1)">+</button>
    </td>
  `;
  hardwareBody.appendChild(row);
});
  
  // Update quantity
  const updateQuantity = (index, delta) => {
    hardware[index].quantity = Math.max(0, hardware[index].quantity + delta);
    document.getElementById(`quantity-${index}`).textContent = hardware[index].quantity;
    updateQuote();
  };
  
  // Update discount
  const updateDiscount = (index, discount) => {
    hardware[index].discount = Math.min(50, Math.max(0, parseFloat(discount) || 0));
    const prices = calculatePrices(hardware[index].cost, hardware[index].discount);
    document.getElementById(`purchasing-${index}`).textContent = `$${prices.purchasing}`;
    document.getElementById(`financing-${index}`).textContent = `$${prices.financing}`;
    updateQuote();
  };

  const enforceDiscountLimit = (input) => {
    if (parseFloat(input.value) > 50) {
      input.value = 50; // Maximum allowed discount
    }
    if (parseFloat(input.value) < 0) {
      input.value = 0; // Minimum allowed discount
    }
  };
  
  // Update results
  const updateQuote = () => {
  const pricingModel = document.querySelector('input[name="pricingModel"]:checked').value;
  const selectedDevicesList = document.getElementById("selectedDevicesList");
  const totalCostElement = document.getElementById("totalCost");
  const finalDiscountInput = document.getElementById("finalDiscount");

  selectedDevicesList.innerHTML = "";
  let totalCost = 0;

  if (pricingModel === "financing") {
    finalDiscountInput.parentElement.style.display = "none";
  } else {
    finalDiscountInput.parentElement.style.display = "block";
  }

  hardware.forEach((device, index) => {
    if (device.quantity > 0) {
      const prices = calculatePrices(device.purchasingPrice, 0); // No per-item discount
      const price =
        pricingModel === "purchasing"
          ? prices.purchasing
          : (prices.financing - 1000) / 24; // Calculate monthly installment for financing
      const displayPrice =
        pricingModel === "purchasing"
          ? prices.purchasing
          : `Monthly Installment: $${price.toFixed(2)}`;
      const deviceTotal = pricingModel === "purchasing"
        ? device.quantity * parseFloat(prices.purchasing)
        : device.quantity * parseFloat(prices.financing);

      totalCost += deviceTotal;

      const listItem = document.createElement("li");
      listItem.textContent = `${device.quantity} × ${device.name} (${displayPrice})`;
      selectedDevicesList.appendChild(listItem);
    }
  });

  if (pricingModel === "purchasing") {
    const finalDiscount = Math.max(
      0,
      Math.min(50, parseFloat(finalDiscountInput.value) || 0)
    );
    const discountedTotalCost = totalCost * (1 - finalDiscount / 100);

    totalCostElement.innerHTML = `
      Total Cost (${pricingModel.charAt(0).toUpperCase() + pricingModel.slice(1)}): 
      <span style="text-decoration: line-through;">$${totalCost.toFixed(2)}</span> → 
      <strong>$${discountedTotalCost.toFixed(2)}</strong> 
      (Discount: ${finalDiscount}%)
    `;
  } else {
    totalCostElement.innerHTML = `
      Total Monthly Installments (${pricingModel.charAt(0).toUpperCase() + pricingModel.slice(1)}): 
      <strong>$${(totalCost / 24).toFixed(2)} per month</strong>
    `;
  }
};

  
  
  
