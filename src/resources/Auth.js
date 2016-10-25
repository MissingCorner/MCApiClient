/**
 * creboard_v2
 * Auth.js
 *
 * Created by Nhan Dang on 8/6/16.
 */
import Resource from '../Resource'
import { method } from '../Method'

class Auth extends Resource {
  constructor(bitclub, urlData) {
    super(bitclub, urlData)
    this.path = ''
  }

  login(username, password, code) {
    const data = {
      grant_type: 'password',
      client_id: 1,
      client_secret: 'anothersecretpass34',
      username,
      password,
    }
    if (code) {
      data.code = code
    }
    return method({
      method: 'POST',
      auth: false,
      path: 'access_token',
    }).apply(this, [data])
  }

  revoke() {
    return method({
      method: 'POST',
      auth: true,
      path: 'revoke_token',
    }).apply(this, arguments)
  }

}

export default Auth
