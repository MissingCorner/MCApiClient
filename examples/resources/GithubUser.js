import { Resource, method } from '../index'

class GithubUser extends Resource {
  constructor(bitclub, urlData) {
    super(bitclub, urlData)
    this.path = 'users'
  }

  getInfo = method({
    path: '{username}',
    method: 'GET',
    auth: false,
    urlParams: ['username'],
  })



}

export default GithubUser
