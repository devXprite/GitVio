/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
// const byteSize = require("byte-size");
const fetcher = require("./fetcher");

const query = `
query userInfo($login: String!) {
    user(login: $login) {
      login
      repositoriesContributedTo(
        first: 6
        contributionTypes: [PULL_REQUEST]
        orderBy:{direction:DESC, field:STARGAZERS}
      ) {
        edges {
          node {
            name
            description
            stargazerCount
            forkCount
            diskUsage
            url
            createdAt
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

const fetchContribution = (username) => {
  const contributedProject = [];
  return new Promise((resolve, reject) => {
    fetcher(query, username).then((response) => {
      const { edges } = response.user.repositoriesContributedTo;
      edges.forEach((edge) => {
        edge.node.language = (edge.node.primaryLanguage) ? edge.node.primaryLanguage.name : "";
        edge.node.languageColor = (edge.node.primaryLanguage) ? edge.node.primaryLanguage.color : null;
        delete edge.node.primaryLanguage;
        contributedProject.push(edge.node);
      });
      resolve(contributedProject);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = fetchContribution;
