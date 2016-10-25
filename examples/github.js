import GithubUser from './resources/GithubUser'

import client from '../index'

client.setResources({ GithubUser }) //Invoke once only

client.githubUser.getInfo('akitoeki')
  .then(res => {
    console.log(res)
  })
