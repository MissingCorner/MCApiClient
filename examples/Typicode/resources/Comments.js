import { Resource, method } from '../../../src/MCApiClient'

class Comments extends Resource {
  constructor(client, urlData) {
    super(client, urlData)
    this.path = 'comments'
    this.authRequired = false
  }

  getByPost = method({
    method: 'GET',
    path: '?postId={id}',
    urlParams: ['id'],
  })
}

export default Comments
