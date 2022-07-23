const fetcher = require("./fetcher");

const query = `
    query userInfo($login: String!) {
    user(login: $login) {
      repositories(
        first: 6
        isFork: false
        ownerAffiliations:OWNER
        orderBy: {direction: DESC, field: STARGAZERS}
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

const fetchPopularRepos = (username) => {
    let popularProject = [];
    return new Promise((resolve, reject) => {
        fetcher(query, username).then((response) => {
            let edges = response.user.repositories.edges;
            edges.forEach(edge => {
                edge.node["language"] = (edge.node.primaryLanguage) ? edge.node.primaryLanguage.name : null;
                edge.node["languageColor"] = (edge.node.primaryLanguage) ? edge.node.primaryLanguage.color : null;
                delete edge.node.primaryLanguage;
                popularProject.push(edge.node);
            });
            resolve(popularProject);
        }).catch((error) => {
            reject(error)
        })
    })

}
module.exports = fetchPopularRepos;