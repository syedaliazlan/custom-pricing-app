/**
 * A Shopify Cart Transformer Function to apply dynamic volume-based pricing.
 * @param {Object} input - The input object containing cart data.
 * @returns {Object} - The result containing the cart operations.
 */
export function run(input) {
  console.log("Input Cart Data: ", JSON.stringify(input.cart, null, 2));

  const NO_CHANGES = {
    operations: [],
  };

  // Process each cart line and build operations
  const operations = input.cart.lines.reduce((acc, line) => {
    console.log("Processing Line: ", JSON.stringify(line, null, 2));

    const updateOperation = buildUpdateOperation(line);
    if (updateOperation) {
      console.log("Update Operation: ", updateOperation);
      acc.push({ update: updateOperation });
    }
    return acc;
  }, []);

  return operations.length > 0
    ? { operations }
    : { operations: [], logs: ["No applicable changes made"] };
}

/**
 * Build the update operation for a single cart line.
 * @param {Object} line - The cart line object.
 * @returns {Object|null} - The update operation or null if no changes.
 */
function buildUpdateOperation(line) {
  const { id: cartLineId, quantity, merchandise } = line;

  // Access the volume pricing metafield
  const volumePricingMetafield = merchandise?.product?.defaultVolumePricing;

  if (!volumePricingMetafield || !volumePricingMetafield.value) {
    console.error("No volume pricing metafield found for line:", cartLineId);
    return null; // Skip if no volume pricing is available
  }

  // Parse the JSON pricing data
  let pricingArray;
  try {
    pricingArray = JSON.parse(volumePricingMetafield.value);
  } catch (error) {
    console.error("Invalid JSON in volume pricing metafield:", error);
    return null;
  }

  // Determine the correct price based on quantity
  let selectedPrice = null;
  pricingArray.forEach((tier) => {
    let min, max;

    // Handle open-ended ranges like "16+"
    if (tier.name.includes("+")) {
      min = parseInt(tier.name.replace("+", ""));
      max = null; // No upper limit
    } else {
      const rangeParts = tier.name.split('-').map(Number);
      min = rangeParts[0];
      max = rangeParts.length > 1 ? rangeParts[1] : null;
    }

    // Check if quantity fits in this pricing tier
    if (quantity >= min && (max === null || quantity <= max)) {
      selectedPrice = parseFloat(tier.price);
    }
  });

  if (selectedPrice === null) {
    console.error("No matching price tier found for line:", cartLineId);
    return null; // Skip if no matching tier was found
  }

  console.log("Selected Price for Line:", cartLineId, "is", selectedPrice);

  // Build the update operation
  return {
    cartLineId,
    price: {
      adjustment: {
        fixedPricePerUnit: {
          amount: selectedPrice.toFixed(2), // Convert to a fixed-point string for Shopify API
        },
      },
    },
  };
}
