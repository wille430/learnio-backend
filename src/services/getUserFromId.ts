import UserModel from '../models/User'

const getUserFromId = async (req: any, res: any): Promise<any> => {
    const { user_id } = req.user
    // Find user in db
    const user = await UserModel.findOne({ _id: user_id })
    if (!user) return res.status(404).send('User not found')

    return user
}

export default getUserFromId