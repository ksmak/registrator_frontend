import instance from './instance'
import userRequestsModule from './userRequests'

export default {
  userRequests: userRequestsModule(instance), 
}