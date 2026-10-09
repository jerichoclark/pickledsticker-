# Pickled Sticker Shop: Setup Guide for Master

Everything for the shop is built. These are the only things you need to do yourself,
in order. No coding needed; you'll only be copy-pasting.

## What's in the folder

| File | What it is | Will you edit it? |
|---|---|---|
| `config.js` | Shop settings: PayPal ID, shipping price, email | **Yes** |
| `products.js` | Your list of tumblers, prices and descriptions | **Yes** |
| `images/` | Tumbler photos (placeholders for now) | **Yes**, drop photos in here |
| `index.html` | The cover page with the Mom / Dad / Custom tabs | No |
| `mom.html`, `dad.html`, `custom.html` | The three shop pages, each with its own style | No |
| `styles.css`, `app.js` | The look and the shopping bag / checkout engine | No |

## Step 1: Fill in your email

Open `config.js` and replace `PASTE_YOUR_SHOP_EMAIL_HERE` with the email customers
should use for custom orders. Keep the quote marks.

## Step 2: Get your PayPal Client ID

The Client ID is a long code that tells PayPal "payments on this site go to my account."
It is safe to put on a website. **The "Secret" next to it is not; never paste that anywhere.**
This site doesn't need the Secret at all.

1. Go to **https://developer.paypal.com** and click **Log in to Dashboard**.
   Log in with your normal PayPal Business login.
2. Click **Apps & Credentials** at the top.
3. You'll see a switch for **Sandbox** and **Live**. Start on **Sandbox** (that's practice mode, fake money).
4. Click **Create App** (or open the "Default Application" if one is already listed).
   Name it `Pickled Sticker`, type **Merchant**, then **Create App**.
5. Copy the **Client ID** (the long code under the app name).
6. Open `config.js` and paste it in place of `PASTE_YOUR_PAYPAL_CLIENT_ID_HERE`, keeping the quotes.

Or just paste the Client ID to Claude in the project chat and Claude will put it in for you.

## Step 3: Do a practice purchase (Sandbox)

1. In the PayPal developer dashboard, go to **Testing Tools → Sandbox Accounts**.
   PayPal makes a fake "Personal" buyer account for you. Click the three dots → **View/Edit Account** to see its email and password.
2. On the shop, add a tumbler to the cart and click the PayPal button.
3. Log in with that **fake buyer** email/password and pay.
4. You should see the "Thank you!" popup. The order appears in your **sandbox** business account, not your real one.

## Step 4: Switch on real payments (Live)

1. Back in **Apps & Credentials**, flip the switch to **Live**.
2. Create the app again the same way and copy the **Live** Client ID.
3. Replace the sandbox Client ID in `config.js` with the live one.

That's it, real money now goes to your PayPal.

## Step 5: Add your photos

1. Take square photos if you can (same width and height). Phone photos are fine.
2. Put them in the `images` folder, named simply, like `pickle-party.jpg`.
3. In `products.js`, change that tumbler's `image:` line to match, e.g. `image: "images/pickle-party.jpg",`.

To add a new tumbler, copy one whole `{ ... },` block in `products.js`, paste it below, and change the words and price.
The `shop:` line decides which tab it shows up in: `"mom"`, `"dad"`, or `"custom"`. Use `"all"` to show it on every tab (like the Pickle Party brand cup).
To mark one sold out, change `inStock: true` to `inStock: false`.

## How orders work (important)

- When someone buys, PayPal emails you a payment notice with the **items, quantities,
  any personalization text, and the buyer's shipping address**. That email is your packing slip.
- You'll also see every order in your PayPal account under **Activity**.
- **Before you ship, glance at the amount paid and make sure it matches the items.**
  Because this shop has no server, a very sneaky person could in theory tamper with prices
  in their browser. It's rare, but checking takes two seconds. If an amount looks wrong, refund it in PayPal.

## Getting it online

Your shop's address is **https://pickledsticker.lol**.
The site is hosted free on GitHub Pages; the `CNAME` file in this folder tells GitHub to answer
for pickledsticker.lol, and your domain company's DNS settings point the name at GitHub.
