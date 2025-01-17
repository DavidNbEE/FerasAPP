import Users from "../models/UserModel.js";
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(401)
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        })
        if (!user[0]) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) return res.sendStatus(403)
            const userId = user[0].id
            const email = user[0].email
            const name = user[0].name
            const jobPosition = user[0].job_position
            const employeeId = user[0].employee_id
            const accessToken = jwt.sign({ userId, email, name, jobPosition, employeeId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.json({accessToken})
        })
    } catch (error) {

    }
}