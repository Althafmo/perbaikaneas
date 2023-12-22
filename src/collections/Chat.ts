import { CollectionConfig } from 'payload/types'
import Users from './Users'
import  authenticatedUser  from '../access/authenticatedUser'

const Chat: CollectionConfig = {
  slug: 'Chat',
  admin: {
    useAsTitle: 'Chat',
  },
  access: {
    read: authenticatedUser,
    create:authenticatedUser,
  },
  fields: [
    {
        name: "Message",
        type: 'textarea',
        minLength:1,
        maxLength:500,
        required:true
    },
    {
      name: "SentBy",
      type: 'relationship',
      relationTo: 'users'
    },
    {
      name: "ReceivedBy",
      type: 'relationship',
      relationTo: 'users'
    }
  ],
}

export default Chat