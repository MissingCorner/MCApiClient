import { Resource, method } from '../../../src/MCApiClient'

class Posts extends Resource {
  constructor(client, urlData) {
    super(client, urlData)
    this.path = 'posts'
    this.authRequired = false
    this.includeBasicMethod(['create', 'list', 'retrieve', 'update', 'del'])
  }

  byUser = method({
    method: 'GET',
    path: '?userId={id}',
    urlParams: ['id'],
  })

  //Another variant, used when want to specifically check params before posting
  comments = (id) => {
    if (id != 0) {
      params = [id] //It's an array
      return method({
        method: 'GET',
        path: '{id}/comments?{opVar}',
        urlParams: ['id','optional!opVar']
      }).apply(this, params)
    } else {
      throw "ID should not be 0"
    }
  }
}

export default Posts
