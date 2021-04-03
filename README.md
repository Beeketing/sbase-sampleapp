ShopBase SampleApp
===================

SampleApp can help you quickly understand how ShopBase app works with a full api & auth server (in `backend` folder)
with vue dashboard (in `dashboard` folder).

## Installation

### Prepare env

1. NodeJS (tested with nodejs 8)
2. Yarn

Additional

```bash
npm install -g nodemon
```

### Backend

#### Prepare your database

1. Create a local mysql database
2. Edit development mysql server in `backend/config/config.json`

#### Install vendors & database

```bash
cd backend
yarn install
npx sequelize db:migrate
```

#### Launch api web server

```bash
yarn dev
```

Your api server is now live at `http://127.0.0.0:3000`

### Dashboard

#### Launch dashboard

```bash
cd dashboard
yarn install
yarn dev
```

Your dashboard is now live at `http://127.0.0.1:8080`. Now you can open your dashboard and start installing SampleApp from your local server.

## Extend

You can use this repo as code base to write your own app, follow instruction on [ShopBase Developers](https://developers.shopbase.com)
to create your own app, then replace your app tokens in `backend/config/*`

## Test webhook

After test main auth flow (required), have your shop access token in database. To test webhook, please follow below steps.

### Prepare env

1. Go to https://ngrok.com and sign up for a free account
2. Follow ngrok instruction to setup ngrok in your computer
3. Run `ngrok http 3000` to start a ngrok tunnel to your http://127.0.0.1:3000 endpoint
4. Update `backend/config/config.default.js` with key `webhookBaseUrl` to match your ngrok endpoint
5. Visit http://127.0.0.1:3000/v1/orders/register-webhook to register `order/create` webhook on your shop
6. Go to your shop and create a new order
7. You should see ngrok console log with webhook request