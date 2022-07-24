const fetchContribution = require("./fetchContribution");
const fetcher = require("./fetcher");
const fetchPopularRepos = require("./fetchPopularRepos");
const fetchStats = require("./fetchStats");
const fetchLanguage = require("./fetchLanguage");
const fetchContributionCalendar = require("./fetchContributionCalendar");

const query = `
query userInfo($login: String!) {
    user(login: $login) {
      login
      avatarUrl(size: 300)
      bio
      company
      id
      isBountyHunter
      isCampusExpert
      isDeveloperProgramMember
      isEmployee
      isFollowingViewer
      isGitHubStar
      isHireable
      location
      name
      twitterUsername
      websiteUrl
    }
  }
`;

const main = async (username) => {

    let mainData = {};
    return new Promise((resolve, reject) => {

        Promise.allSettled([
            fetcher(query, username),
            fetchContribution(username),
            fetchPopularRepos(username),
            fetchStats(username),
            fetchLanguage(username),
            fetchContributionCalendar(username)
        ])
            .then(async ([basic, res1, res2, res3, res4, res5]) => {
                Object.assign(mainData, basic.value.user)
                mainData.contributedRepos = res1.value;
                mainData.popularRepos = res2.value;
                mainData.stats = res3.value;
                mainData.topLanguages = res4.value;
                mainData.contributionCalendar = res5.value;
            })
            .catch(error => {
                reject(error);
            }).then(() => {
                resolve(mainData)
            })
    })
}

module.exports = main;