/**
 * creboard_v2
 * BitclubMethod.basic.js
 *
 * Created by Nhan Dang on 8/6/16.
 */
import { method } from './Method'

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
  listPage: method({
    method: GET,
    path: '?limit={limit}&offset={offset}&orderByField={orderByField}&orderDirection={orderDirection}',
    urlParams: ['limit', 'offset', 'orderByField', 'orderDirection'],
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

