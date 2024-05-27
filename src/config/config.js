import dotenv from 'dotenv'

dotenv.config();

export default{
    port:process.env.PORT,
    mongoUrl:process.env.URL_MONGODB,
    tokenKey: process.env.TOKEN_KEY,
    clientIdGitHub:process.env.CLIENT_ID_GITHUB,
    clienteSecretsGitHub: process.env.CLIENT_SECRETS_GITHUB
}