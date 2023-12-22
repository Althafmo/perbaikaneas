import { Access } from 'payload/config'

const authenticatedUser: Access = ({ req: { user } }) => {
  // allow authenticated users
  if (user) {
    return true
  }
  else return false;
}
export default authenticatedUser
