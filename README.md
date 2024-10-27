## Setup

1. Clone the repository
2. Run `yarn install` to install all dependencies
3. Create a `.env` file in the root directory and add the following environment variables
```
PORT=5000
OPENAI_API_KEY=your_openai_api_key
```
4. Run client and server  : <br>
`yarn workspace client start` to start the client <br>
`yarn workspace server start` to start the server

or you can directly use `yarn start` to run both client and server concurrently