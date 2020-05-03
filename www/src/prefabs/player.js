import Layout from './layout.js'
import RoomService from '../services/room.js'

const RoomPipe = RoomService.pipe
export default (user) => Layout.El('div', user.username,
    Layout.El('p', RoomService.ui().health[user.username])
    )
