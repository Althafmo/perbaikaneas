import { CollectionConfig } from 'payload/types'
import authenticatedUser from '../access/authenticatedUser'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'Username',
  },
  access: {
    read: authenticatedUser,
    update: authenticatedUser,
    create: ()=> true
  },
  fields: [
    {
      name: 'Username',
      type: 'text',
      minLength: 1,
      maxLength: 50,
      required: true,
      unique:true
  }
  ],
}

export default Users
