# 📘 Custom Pricing Shopify App – Documentation

This project is a **Shopify Function Extension** that customises product pricing during checkout using Shopify's extensible app platform. It allows you to define and apply custom logic such as discounts, rule-based pricing, or dynamic price adjustments.

---

## 🚀 Overview

This app demonstrates how to:
- Use Shopify Function Extensions (`run.js`) to override default pricing behavior.
- Leverage GraphQL (`run.graphql`) to define input/output structures for pricing logic.
- Configure and deploy pricing logic directly to a Shopify store.

---

## 📁 Project Structure

```
custom-pricing-app-main/
├── extensions/
│   └── custom-pricing-app/
│       ├── src/
│       │   ├── index.js             # Entry point for the extension
│       │   ├── run.js               # Custom pricing logic
│       │   ├── run.graphql          # Defines inputs and outputs
│       │   └── run.test.js          # Unit tests (optional)
│       ├── schema.graphql          # Shopify function schema
│       ├── shopify.extension.toml  # Extension configuration
├── shopify.app.toml                # Shopify app definition
├── package.json                    # App dependencies
```

---

## 🛠️ How It Works

### `run.js`

This file contains the core logic of your Shopify pricing function. For example:

```js
export default (input) => {
  const targets = input.cart.lines.map(line => ({
    productVariantId: line.merchandise.id,
    priceAdjustment: {
      adjustment: {
        fixedPricePerUnit: { amount: "9.99" },
      },
    },
  }));

  return { functionResult: { priceAdjustments: targets } };
};
```

📝 This applies a flat price of `9.99` to every cart item.

---

## 🧩 GraphQL Contracts

### `run.graphql`

Defines input and output types for Shopify's runtime:

```graphql
input RunInput {
  cart: Cart!
}

type RunOutput {
  priceAdjustments: [CartLinePriceAdjustment!]!
}
```

---

## ⚙️ Configuration

### `shopify.extension.toml`

Declares your extension type and function API version:

```toml
name = "custom-pricing-app"
type = "product_discounts"
api_version = "2023-07"
```

### `shopify.app.toml`

Ties everything together for deployment. Define app name, scopes, extensions, etc.

---

## 🧪 Local Development

```bash
npm install
npm run dev
```

- Use the [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) to preview and push your app
- Ensure you've authenticated with your Partner org

### Preview the extension:
```bash
shopify extension serve
```

### Deploy the extension:
```bash
shopify deploy
```

---

## 🔐 Required Permissions

Make sure your app is granted appropriate **Admin API scopes** and is installed on a development store.

---

## 📦 Deployment Notes

- Shopify CLI is required to manage deployment (`shopify login`, `shopify deploy`)
- Register your function extension on the Shopify dashboard after deploying
- Use `run.test.js` for testing your custom logic locally

---

## 👨‍💻 Technologies Used

- JavaScript (ESM)
- Shopify Functions & GraphQL
- Shopify CLI
- TOML for config
- Vite (via `vite.config.js`)

---

## 📄 License

MIT – Free to use, fork, and customise.

---

## ✨ Tips

- Modify `run.js` to include advanced logic like tag-based pricing, volume discounts, etc.
- You can define multiple extensions in one app (e.g., delivery customization, validation, etc.)

Made with ❤️ by Ali
