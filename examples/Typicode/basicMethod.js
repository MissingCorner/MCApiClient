/**
 * creboard_v2
 * BitclubMethod.basic.js
 *
 * Created by Nhan Dang on 8/6/16.
 */
import { method } from '../../src/MCApiClient'

const POST = 'POST'
const GET = 'GET'
const DELETE = 'DELETE'
const PUT = 'PUT'

export default {
  create: method({
    method: POST,
  }),
  list: method({
    method: GET,
  }),
  retrieve: method({
    method: GET,
    path: '{id}',
    urlParams: ['id'],
  }),
  update: method({
    method: PUT,
    path: '{id}',
    urlParams: ['id'],
  }),
  del: method({
    method: DELETE,
    path: '{id}',
    urlParams: ['id'],
  }),
}

