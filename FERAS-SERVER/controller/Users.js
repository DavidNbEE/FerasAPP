import Users from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Attendance from "../models2/attendanceModel.js";

export const getUsers = async (req, res) => {
    try {
        const userEmail = req.email; // Mengambil email dari decoded token
        const user = await Users.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Jika pengguna ditemukan, maka hanya kembalikan data pengguna itu saja
        const userData = { id: user.id, name: user.name, email: user.email, job_position: user.job_position, employeeId : user.employee_id};
        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confirmPassword, jobPosition, employeeId } = req.body;

    if (!name || !email || !password || !confirmPassword || !jobPosition || !employeeId) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" })
    }

    try {
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
            job_position: jobPosition,
            employee_id: employeeId
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const employeeId = user.employee_id;

        const accessToken = jwt.sign({ userId, name, email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        const refreshToken = jwt.sign({ userId, name, email}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // Update refresh token in the Users table
        await Users.update({ refresh_token: refreshToken }, { where: { id: userId } });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Add attendance record if not already exists
        const today = new Date().toLocaleDateString();
        const existingAttendance = await Attendance.findOne({
            where: {
                userId: userId,
                date: today
            }
        });

        if (!existingAttendance) {
            await Attendance.create({
                userId: userId,
                date: today,
                day: new Date().getDay(),
                employee_id: employeeId
            });
        }

        res.json({ accessToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })
    if(!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await Users.update({refresh_token: null}, {where: {id: userId}})

    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}
export const getCheckInTime = async (req, res) => {
    try {
        const { userId } = req.body; // Ambil userId dari body permintaan
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const today = new Date().toLocaleDateString();
        const userAttendance = await Attendance.findOne({
            where: {
                userId: userId,
                date: today
            }
        });

        if (!userAttendance) {
            return res.status(404).json({ message: "Check in record not found" });
        }

        if (userAttendance.checkinTime) {
            return res.json({ message: `Anda telah masuk pada pukul: ${userAttendance.checkinTime}` });
        } else {
            return res.json({ message: "Anda belum absen" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const saveCheckInTime = async (req, res) => {
    const { detectedLabel, userId } = req.body;
  
    try {
      const userAttendance = await Attendance.findOne({
        where: {
          userId: userId,
          date: new Date().toLocaleDateString()
        }
      });
  
      if (!userAttendance) {
        return res.status(404).json({ message: "User attendance not found" });
      }
  
      // Check if detected label matches employee ID
      if (userAttendance.employee_id === detectedLabel) {
        // Update check-in time
        if (!userAttendance.checkinTime) {
          userAttendance.checkinTime = new Date().toLocaleTimeString();
          await userAttendance.save();
          res.status(201)
          return res.status(201).json({ message: `Check-in recorded at ${userAttendance.checkinTime}` });
        } else {
          return res.json({ message: `You have already checked in at ${userAttendance.checkinTime}` });
        }
      } else {
        res.status(400)
        return res.status(404).json({ message: "anda tidak dikenali, Ulangi sekali lagi." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const saveCheckOutTime = async (req, res) => {
    const { detectedLabel, userId, userNote } = req.body;

    try {
        const userAttendance = await Attendance.findOne({
            where: {
                userId: userId,
                date: new Date().toLocaleDateString()
            }
        });

        if (!userAttendance) {
            return res.status(404).json({ message: "User attendance not found" });
        }

        if (userAttendance.employee_id === detectedLabel) {
            if (!userAttendance.checkOutTime) {
                const checkOutTime = new Date().toLocaleTimeString();
                const checkInTime = new Date(`1970-01-01T${userAttendance.checkinTime}`);
                const checkOutTimeObj = new Date(`1970-01-01T${checkOutTime}`);
                const durationMs = checkOutTimeObj - checkInTime;
                const durationHours = durationMs / (1000 * 60 * 60);
                const overWork = Math.max(0, durationHours - 8);

                userAttendance.checkOutTime = checkOutTime;
                userAttendance.duration = durationHours.toFixed(2) + " hours";
                userAttendance.OverWork = overWork.toFixed(2) + " hours";
                userAttendance.userNote = userNote;
                await userAttendance.save();
                res.status(201)
                return res.status(201).json({ message: `Absen keluar tercatat ${checkOutTime}` });
            } else {
                res.status(400)
                return res.status(400).json({ message: `Anda sudah melakukan absen keluar pada:  ${userAttendance.checkOutTime}` });
            }
        } else {
            return res.json({ message: "anda tidak dikenali, Ulangi sekali lagi." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getactivity = async (req, res) => {
    const { userId } = req.query;

    try {
      const activities = await Attendance.findAll({
        where: { userId: userId },
      });
  
      if (!activities) {
        return res.status(404).json({ message: "No activities found for this user" });
      }
  
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}
