const fetcher = require("./fetcher");

const query = `
query userInfo($login: String!) {
    user(login: $login) {
      login
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionLevel
              date
              contributionCount
            }
          }
        }
        totalCommitContributions
      }
    }
  }`;

const fetchContributionCalendar = async (username) => new Promise((resolve, reject) => {
  const contributionCalendar = [];
  fetcher(query, username).then((response) => {
    const { weeks } = response.user.contributionsCollection.contributionCalendar;

    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        contributionCalendar.push(day);
      });
    });
  }).then(() => {
    resolve(contributionCalendar);
  }).catch((error) => {
    reject(error);
  });
});

module.exports = fetchContributionCalendar;
