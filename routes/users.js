var _ = require("lodash");
const byteSize = require('byte-size')
var createError = require('http-errors');
const moment = require("moment")
const dotenv = require("dotenv");
const NodeCache = require("node-cache");
const { default: axios } = require('axios');

dotenv.config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.TOKEN;

axios.defaults.auth = {
  username: USERNAME,
  password: PASSWORD
}

var express = require('express');
var router = express.Router();

const cache = new NodeCache({ stdTTL: 60 * 60 * 1 });

const removeForks = (userRepoObj) => {
  let tmp = [];
  userRepoObj.forEach(repo => {
    if (!repo.fork) {
      tmp.push(repo);
    }
  });

  return tmp;
}

const getPopularRepo = async (reposObj, maxCount) => {

  let rerurnData = [];
  let orderByStars = _.orderBy(reposObj, ["stargazers_count"], ["desc"]);

  for (let i = 0; i < (orderByStars.length > maxCount ? maxCount : orderByStars.length); i++) {
    let repo = orderByStars[i];
    if (!repo.fork) {
      rerurnData.push({
        name: repo.name,
        html_url: repo.html_url,
        language: repo.language,
        size: `${byteSize(repo.size * 1000)}`,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count
      });
    }
  }
  return rerurnData;
}

const getLanguage = async (userRepoObj, maxCount) => {
  let allLanguages = { total: 0 };

  return new Promise((resolve, reject) => {
    Promise.allSettled(
      userRepoObj.slice(0, maxCount).map((repo) => {
        return new Promise((resolve, reject) => {
          axios.get(repo.languages_url).then((response) => {
            let responseData = response.data;

            Object.keys(responseData).forEach(language => {
              let currentLangSize = (allLanguages[language]) ? allLanguages[language] : 0;
              allLanguages[language] = currentLangSize + parseInt(responseData[language]);
              allLanguages.total += responseData[language];
            });

          }).catch((error) => {
            // do nothing
          }).then(() => {
            resolve()
          })
        })
      })
    ).then(() => {
      Object.keys(allLanguages).map((lang) => {
        if (lang != "total") {
          allLanguages[lang] = parseFloat((allLanguages[lang] / allLanguages.total * 100)).toFixed(2);
        }
      })
      delete allLanguages.total;
      resolve(allLanguages)
    })
  })


}

const getContributedRepo = async (issuesObj, maxCount) => {

  let contributedRepoUrls = [];
  let contributedRepoDetails = [];
  let maxReposCount = (issuesObj.length > maxCount ? maxCount : issuesObj.length);

  issuesObj.forEach(repo => {
    if (repo.author_association == "CONTRIBUTOR" && (contributedRepoUrls.length < maxReposCount) && !contributedRepoUrls.includes(repo.repository_url)) {
      contributedRepoUrls.push(repo.repository_url);
    }
  });

  await Promise.allSettled(
    contributedRepoUrls.map(
      async (url) => {
        let repo = (await axios(url)).data;
        contributedRepoDetails.push({
          name: repo.name,
          html_url: repo.html_url,
          language: repo.language,
          size: `${byteSize(repo.size * 1000)}`,
          description: repo.description,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count
        })
      }
    )
  );

  return new Promise(
    (resolve, reject) => {
      resolve(contributedRepoDetails);
    }
  )
}

router.get('/@:username', async (req, res, next) => {
  var username = req.params.username;
  var regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w-.]{0,39}$/gi;

  let renderData = {};

  if (!regex.test(username)) {
    next();
    return
  }

  if (cache.has(username)) {
    let userNameData = cache.get(username);
    console.log(`Sending Response from cache memory`);
    res.render('user', userNameData);
    return
  }

  try {
    const userObj = (await axios(`https://api.github.com/users/${username}`)).data;
    const userRepos = removeForks((await axios(`https://api.github.com/users/${username}/repos?per_page=100`)).data);
    // const userPR = removeForks(((await axios(`https://api.github.com/search/issues?q=type:pr+is:merged+author:${username}&per_page=100`)).data).items);

    Object.assign(renderData, {
      title: `${username}'s Portfolio`,
      name: userObj.name || userObj.login,
      username: userObj.login,
      following: userObj.following,
      followers: userObj.followers,
      website: userObj.blog,
      location: userObj.location,
      bio: userObj.bio,
      twitter_username: userObj.twitter_username,
      avatar: userObj.avatar_url,
      hireable:userObj.hireable
    })

    // renderData.popularProjects = await getPopularRepo(userRepos, 6);
    // renderData.contributedProject = await getContributedRepo(userPR, 6);
    // renderData.languages = await getLanguage(userRepos, 10);
    renderData.popularProjects = await getPopularRepo(userRepos, 6);
    // renderData.contributedProject = await getContributedRepo(userPR, 3);
    // renderData.languages = await getLanguage(userRepos, 3);

    console.log(renderData);
    res.render('user', renderData);
    cache.set(username, renderData);
  } catch (error) {

    if (error.code == "ERR_BAD_REQUEST") {
      let limitReset = moment(error.response.headers["x-ratelimit-reset"] * 1000).toNow(true);
      next(createError(529, `Try again in ${limitReset}`));
    } else {
      next(createError(500));
    }

  }

});

module.exports = router;
