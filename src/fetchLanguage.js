/* eslint-disable array-callback-return */
/* eslint-disable max-len */
const fetcher = require("./fetcher");

const query = `
query userInfo($login: String!) {
  user(login: $login) {
    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
      nodes {
        name
        languages(first: 15, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
            }
          }
        }
      }
    }
  }
}
`;
const updateLang = {
  SCSS: "SASS",
  "C++": "CPP",
  JADE: "PUG",
  "C#": "C Sharp",
};

const fetchLanguage = async (username) => {
  const allLanguages = { total: 0 };

  return new Promise((resolve, reject) => {
    fetcher(query, username).then((response) => {
      response.user.repositories.nodes.forEach((repo) => {
        repo.languages.edges.forEach((lang) => {
          const currentLang = lang.node.name;
          const currentLangSize = (allLanguages[currentLang]) ? allLanguages[currentLang] : 0;
          allLanguages[currentLang] = currentLangSize + lang.size;
          allLanguages.total += lang.size;
        });
      });
      Object.keys(allLanguages).map((lang) => {
        if (lang !== "total") {
          allLanguages[lang] = parseFloat(((allLanguages[lang] / allLanguages.total) * 100)).toFixed(2);
        }
        if (updateLang[lang]) {
          allLanguages[updateLang[lang]] = allLanguages[lang];
          delete allLanguages[lang];
        }
      });
      delete allLanguages.total;
      resolve(allLanguages);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = fetchLanguage;
