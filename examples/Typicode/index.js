import Posts from './resources/Posts'
import Comments from './resources/Comments'

import basicMethods from './basicMethod'
import client from '../../src/MCApiClient'

// Put these in app config
client.setFullUrl('https://jsonplaceholder.typicode.com') //Quick way to define URL

// Reuse basic methods
client.setBasicMethod(basicMethods) //Basic method definition for the API
// Set resources
client.setResources({ Posts, Comments })

// Use these to fetch
async function test() {
  try {
    const posts = await client.posts.list()
    console.log(posts)

    const created = await client.posts.create({
      title: 'MCApiClient test',
      content: 'Nicely done by Akito Eki'
    })
    console.log(created)

    const post = await client.posts.retrieve(87)
    console.log(post)

    const edited = await client.posts.update(post.id, {
      content: 'Awesome-ly done by Akito Eki'
    })
    console.log(edited)

    const deleted = await client.posts.del(post.id)
    console.log(deleted)

    const postByUser = await client.posts.byUser(1)
    console.log(postByUser)

    const comments = await client.comments.getByPost(post.id)
    console.log(comments)

  } catch (e) {
    console.error(e)
  }

}


test()

