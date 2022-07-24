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


const fetchContributionCalendar = async (username) => {
    let contributionCalendar = [];

    return new Promise((resolve, reject) => {
        fetcher(query, username).then((response) => {
            var weeks = response.user.contributionsCollection.contributionCalendar.weeks;

            weeks.forEach(week => {
                week.contributionDays.forEach(day => {
                    contributionCalendar.push(day)
                });
            });
        }).then(()=>{
            resolve(contributionCalendar)
        })
    })
}

module.exports = fetchContributionCalendar