import { Client, Account, Databases } from "appwrite";
const client = new Client();

client.setEndpoint(import.meta.env.VITE_APP_ENDPOINT).setProject(import.meta.env.VITE_APP_PROJECT_ID)

export const account = new Account(client)
export const database = new Databases(client)




// APPWRITE TEST :

// import { Client, Account, Databases } from "appwrite";
// const client = new Client();
// client.setEndpoint('https://cloud.appwrite.io/v1').setProject('65bf53cf283e824597e5')
// export const account = new Account(client)
// export const database = new Databases(client)
// export const documentsUsers = new Databases(client)