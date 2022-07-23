const fetcher = require("./fetcher");

const query = `
query {
    viewer {
      login
    }
    rateLimit {
      limit
      cost
      remaining
    }
  }
`;

fetcher(query).then((r)=>{
    console.log(r)
})