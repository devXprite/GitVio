const { graphql } = require("@octokit/graphql");
const dotenv = require("dotenv");

dotenv.config();

const { TOKEN } = process.env;

const fetcher = async (query, login) => new Promise((resolve, reject) => {
  graphql(
    query,
    {
      login,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    },
  ).then((response) => {
    resolve(response);
  }).catch((error) => {
    reject(error);
  });
});

module.exports = fetcher;
