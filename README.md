# Shopping list as is

The application allows you to create a shopping list, share and delegate it to your friends and family, and check its status.

## Features

- creating a few cards for shopping
- each card can have a title, a product list and notes
- card editing and removing
- user authentication
- sharing different cards with different users
- card filtering: (done/unfinished)
- multiple languages (for now: en and pl)
- adaptive to different screen sizes (responsive design)

<p align="center"><img src="https://github.com/jovani-x/shopping-list-next/blob/media/friends.webp?raw=true" alt="friendship screen" width="160" styles="max-width: 100%;"> <img src="https://github.com/jovani-x/shopping-list-next/blob/media/shopping-process.webp?raw=true" alt="shopping process screen" width="160" styles="max-width: 100%;"> <img src="https://github.com/jovani-x/shopping-list-next/blob/media/cards.webp?raw=true" alt="an app main screen" width="172" styles="max-width: 100%;"> <img src="https://github.com/jovani-x/shopping-list-next/blob/media/edit-card.webp?raw=true" alt="edit card screen" width="172" styles="max-width: 100%;"> <img src="https://github.com/jovani-x/shopping-list-next/blob/media/card-is-blocked.webp?raw=true" alt="card is blocked" width="144" styles="max-width: 100%;"></p>

It consists of two parts:

- nextjs part (current repo - FrontEnd part + API)
- node/express part ([REST API server](https://github.com/jovani-x/api-shopping-list))

## Getting Started

### Preparing

- set parameters to .env-file _(see [.env.example](https://github.com/jovani-x/shopping-list-next/blob/master/.env.example))_
- deploy REST API server _([api-shopping-list](https://github.com/jovani-x/api-shopping-list))_

### Init dependencies

```
npm i
```

### Run the development server

```
npm run dev
```

### Lint (eslint)

```
npm run lint
```

### Format (prettier)

```
npm run format
```

### Test

```
npm run test
```

```
npm run coverage
```

## Technologies

- next (app router) / react
- typescript
- tailwind / scss
- i18next
- vite
- vitest with testing-library
- msw

## Roadmap

- add a notification indicator to header
- add opportunity to remove an user (buyer) from a list of sharing
- add option to upload a photo(s) for a product to know what it looks like
- add option to add an alternative item for a product
- add more languages
- change a desktop view
- migrate to React v19
- finish tests
