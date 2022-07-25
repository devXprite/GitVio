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
      avatarUrl(size: 200)
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
      email
    }
  }
`;

const fetchAll = async (username) => new Promise((resolve, reject) => {
  const mainData = {};

  Promise.allSettled([
    fetcher(query, username),
    fetchContribution(username),
    fetchPopularRepos(username),
    fetchStats(username),
    fetchLanguage(username),
    fetchContributionCalendar(username),
  ])
    .then(async ([basic, contribution, popularRepos, stats, language, contributionCalendar]) => {
      Object.assign(mainData, basic.value.user);
      mainData.contributedRepos = contribution.value;
      mainData.popularRepos = popularRepos.value;
      mainData.stats = stats.value;
      mainData.topLanguages = language.value;
      mainData.contributionCalendar = contributionCalendar.value;
    })
    .catch((error) => {
      reject(error);
    }).then(() => {
      resolve(mainData);
    });
});

module.exports = fetchAll;
