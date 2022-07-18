var _ = require("lodash");
const byteSize = require('byte-size')
var createError = require('http-errors');
const { default: axios } = require('axios');

var express = require('express');
var router = express.Router();

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

  try {
    const userObj = (await axios(`https://api.github.com/users/${username}`)).data;
    const userRepos = (await axios(`https://api.github.com/users/${username}/repos?per_page=100`)).data;
    const userPR = ((await axios(`https://api.github.com/search/issues?q=type:pr+is:merged+author:${username}&per_page=100`)).data).items;

    Object.assign(renderData, {
      title: `${username}'s Portfolio`,
      name: userObj.login,
      username: userObj.login,
      following: userObj.following,
      followers: userObj.followers,
      website: userObj.blog,
      location: userObj.location,
      bio: userObj.bio,
      twitter_username: userObj.twitter_username,
      avatar: userObj.avatar_url
    })

    renderData.popularProjects = await getPopularRepo(userRepos, 6);
    renderData.contributedProject = await getContributedRepo(userPR, 5);

    console.log(renderData);
    res.render('user', renderData);
  } catch (error) {
    next(createError(500));
    console.log(error);
  }

});

module.exports = router;
