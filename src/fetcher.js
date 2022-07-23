const { graphql } = require("@octokit/graphql");
const dotenv = require("dotenv");

dotenv.config();

const TOKEN = process.env.TOKEN;

const fetcher = async (query, login, max = 10) => {
    return new Promise((resolve, reject) => {
        graphql(query,
            {
                login: login,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                },
            }
        ).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error)
        })
    })
}


module.exports = fetcher;