import GithubUser from './resources/GithubUser'

import client from '../../src/MCApiClient'

// Put this in app config
client.setHost('https://api.github.com', 443)

client.setResources({ GithubUser })


// Use this to fetch
async function test() {

  client.githubUser.getInfo('akitoeki')
    .then(res => {
      console.log(res)
    })

  client.githubUser.getInfo('thisuserdoesnotexist')
    .catch(e => {
      console.error(e)
    })

  // async mode
  const res = await client.githubUser.getInfo('yoshioki')
  console.log(res)
}


test()

