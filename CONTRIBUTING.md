# Contributing to Multi Vendor Ecommerce Project

<br/>

## Getting the project set up locally without Docker

#### Requirements
- Node.js installed locally
- Postgress installed locally [Download Link](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

### 1. Fork and Clone the Repository
```sh
git clone https://github.com/{your-github-username}/ecommerce-react-query-PERN-app.git

cd ecommerce-react-query-PERN-app
```

### 2. Install dependencies
> Server Dependencies
```sh
npm install
```
> React app Dependencies
```sh
cd client
```
```sh
npm install
```


### 3. Copy .env.example to .env

```sh
cp .env.example .env
```
Please have a brief look over the environment variables and change them if necessary, for example, change the ports if you have a conflicting service running on your machine already. Make sure to add your database password and other neccessary configurations to make everything working.

### 5. Running services locally

> Running Express server
```sh
npm run dev
```

> Running React app
```sh
cd client
```
```sh
npm run dev
```

<br/>

If everything went well, the frontend should be running on http://localhost:5173 and the backend api should be accessible through http://localhost:3000. There is a proxy present to also route all requests to http://localhost:3004/api directly to the API.

If one wants to change the PORT number of server app then must update the SERVER_PORT variable in `vite.config.ts` file of the `client` directory.

---****

<br/>

## Prisma
### Handling migrations locally
- Update `schema.prisma` file with any model schema changes.
- In the root directory, run `cd tools`
- Run `npx prisma migrate dev --name <migration-name>`
- Update prisma client, run `npm run prisma:generate`

## Pushing changes to the app

Firstly, ensure that there is a GitHub Issue created for the feature or bugfix you are working on. If it does not exist, create an issue and assign it to yourself.

Once you are happy with the changes you've made locally, commit it to your repository. Note that the project makes use of Conventional Commits, so commit messages would have to be in a specific format for it to be accepted. For example, a commit message to fix the translation on the homepage could look like:

> fix: resolve incorrect user authentication flow

Finally, create a pull request to merge the changes on your forked repository to the original repository hosted on `aniketbhalla2544/ecommerce-react-query-PERN-app`. I can take a look at the changes you've made when I have the time and have it merged onto the app.




