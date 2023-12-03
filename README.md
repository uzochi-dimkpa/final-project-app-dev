# Dimkpa<sup>TM</sup> Budgeting App



## Remote Links

- GitHub Repo:
> https://github.com/uzochi-dimkpa/final-project-app-dev/tree/main

- Frontend:
> https://dimkpatm-budgeting.onrender.com/

- Backend:
> https://dimkpatm-budgeting-api.onrender.com/



## Remote Deploy Instructions

To use the website on the remote server:

1. Click on the <a href='https://dimkpatm-budgeting-api.onrender.com/'>backend link</a>
2. Wait until you see the following on your browser page: 

        "Server is good to go!"

3. Click on the <a href='https://dimkpatm-budgeting.onrender.com/'>frontend link</a>
4. Use the app!



## Repo

To clone the repo locally:

1. `git clone https://github.com/uzochi-dimkpa/final-project-app-dev.git`
2. `cd server`
3. `npm install`
4. `cd ../client`
5. `npm install`

### **NOTE:**
**You will need to make your own `.env` files in both the `server/` and `client/` directories with the proper fields in them in order to run the application:**

1. `cd ../server`
2. Create a new file named `.env`
3. Populate the `.env` file with the following fields:
    - `APPLITOOLS_API_KEY`
      - Your Applitools API key
    - `HEADLESS`
      - Boolean; `true` or `false`
    - `MONGO_DB_REMOTE_URL`
      - Your MongoDB database URL
    - `NODE_VERSION`
      - 18.18.0
    - `ACCESS_TOKEN_SECRET`
      - String; can be any value of your choice
    - `FRONTEND_URL`
      - Remote frontend URL or localhost URL with port of your choice
4. `cd ../client`
5. Create a new file names `.env`
6. Populate the `.env` file with the following fields:
    - `REACT_APP_BACKEND_URL`
      - Remote backend URL or localhost URL with port of your choice



## Local Deploy Instructions

To run the application locally in the development environment, **after having cloned the repo and installed the necessary packages**:
1. `cd server`
2. `npm run dev`

To run the application locally and view the console logs, **after having cloned the repo and installed the necessary packages**:
1. Open two terminals within the root of the same project working directory
2. In the first terminal:
    
    a. `cd server`
    
    b. `npm run dev`

3. In the second terminal:

    a. `cd server`
    
    b. `pm2 logs 0`



## Testing Instructions

To run the application tests:

### Server:
1. Open a new terminal in the root of the repo
2. `cd server`
3. `npm test`
### Client:
1. Open a new terminal in the root of the repo
2. `cd client`
3. `npm test`
### Results:
View the output logged to each console for the results of the tests