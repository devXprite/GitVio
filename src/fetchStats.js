const fetcher = require("./fetcher");

const query = `
query userInfo($login: String!) {
    user(login: $login) {
      name
      login
      following{
        totalCount
      }
      followers {
        totalCount
      }
      gists{
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
      }
      repositoriesContributedTo(
        first: 1
        contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
      ) {
        totalCount
      }
      pullRequests(first: 1) {
        totalCount
      }
      issues(first:1){
        totalCount
      }
      repositories(
        first: 1
        ownerAffiliations: OWNER
      ) {
        totalCount
      }
      organizations(first:1){
        totalCount
      }
      sponsoring(first:1){
        totalCount
      }
      createdAt
      updatedAt
    }
  }
`;

const fetchStats = (username) => {
    let stats = {};
    return new Promise((resolve, reject) => {
        fetcher(query, username).then((response) => {
            let data = response.user;
            stats.following = data.following.totalCount;
            stats.followers = data.followers.totalCount;
            stats.gists = data.gists.totalCount;
            stats.commits = data.contributionsCollection.totalCommitContributions;
            stats.contributedTo = data.repositoriesContributedTo.totalCount;
            stats.pullRequests = data.pullRequests.totalCount;
            stats.issues = data.issues.totalCount;
            stats.repositories = data.repositories.totalCount;
            stats.organizations = data.organizations.totalCount;
            stats.sponsoring = data.sponsoring.totalCount;
            stats.createdAt = data.createdAt
            stats.updatedAt = data.updatedAt;
            resolve(stats);
        }).catch((error) => {
            reject(error)
        })
    })
}

module.exports = fetchStats;