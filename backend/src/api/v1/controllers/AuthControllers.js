//----------- Import the packages from packages, use to make strong apis -------X
const bcrypt = require('bcryptjs'); //Convert password into hash
const jwt = require('jsonwebtoken'); // Tokenized our users

const crypto = require('crypto'); //Use to ciper the tokens 

//-------------- Model Specific Stuff
const UserModel = require('../models/UsersModal'); //User modal


//------------ Utils Specific Stuff
const SendMail = require('../utils/SendMail');


//------------------ Creating the AuthControllers to authenticate the users -----------X
function AuthControllers() {

    return {

        // Register the users, using POST '/api/user/register'
        async Register(req, res) {

            try {
                //--------- Req.body content
                const { name, email, password, cpassword } = req.body;

                //Requring all the specific fields
                if (!name || !email || !password || !cpassword) { return res.status(404).json({ success: false, msg: "All fields are required" }) };

                if (password.length < 8 || cpassword.length < 8)
                    return res.status(404).json({ success: false, msg: "Password & Confirm password must be 8 char long" })

                //check password and confirm password match
                if (password !== cpassword) { return res.status(404).json({ success: false, msg: "Password and ConfrimPassword did not match" }) };

                // Check the user is already register
                let users = await UserModel.findOne({ email })
                if (users) { return res.status(401).json({ success: false, msg: "this crenditentals's user is already exist" }) };

                //Converting the password into hash
                let hashPassword = await bcrypt.hash(password, 10);

                //Register the users
                users = await UserModel({
                    name,
                    email,
                    password: hashPassword
                })
                await users.save();

                return res.status(200).json({ success: true, msg: 'You are successfully register', users });

            } catch (error) { return res.status(500).json({ success: false, msg: error }); }
        },

        // Login the users, using POST '/api/user/login'
        async Login(req, res) {
            try {
                //--------- Req.body content
                const { email, password } = req.body;

                //Requring all the specific fields
                if (!email || !password) { return res.status(404).json({ success: false, msg: "All fields are required" }) };

                // Check the user is not already register
                let users = await UserModel.findOne({ email })
                if (!users) { return res.status(401).json({ success: false, msg: "Your crenditentals is not correct" }) };

                //Comparing the password of register and login user
                let hashPassword = await bcrypt.compare(password, users.password)
                if (!hashPassword) { return res.status(404).json({ success: false, msg: "Your credentials not correct" }) }

                // Now create the token to authorizing the users
                const payloads = {
                    user: { id: users._id }
                }
                const Secret_Key = process.env.JWT_SECRET_KEY 

                const token = await jwt.sign(payloads, Secret_Key, { expiresIn: '10d' })

                return res.status(200).json({ success: true, msg: 'You are successfully login', token });

            } catch (error) { return res.status(500).json({ success: false, msg: error }); }
        },

        // Get the info of login user, using GET '/api/user/getUser'
        async getUser(req, res) {
            try {
                const user = req.user;

                return res.status(200).json({ success: true, msg: `Welcome back ${req.user.name}`, user });

            } catch (error) { return res.status(500).json({ success: true, msg: error }); }
        },

       
        //Forget password, is help the users when they try to login , using POST '/api/user/forgetPassword'
        async forgetPassword(req, res) {

            try {
                //Get constraints from the users
                const { email } = req.body;

                //Find the user by the id
                const user = await UserModel.findOne({ email });

                if (!user) return res.status(404).json({ success: false, msg: 'User is not found,Please check credentials' });

                //After the user found send the mail, with token and reset password token 
                //1. Create the token 
                const resetToken = crypto.randomBytes(20).toString('hex'); //hex the token is built in

                //2. Hash the user reset token and update
                user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

                //3. Define the time to reset the token
                user.resetPasswordTokenTime = Date.now() + 15 * 60 * 60 * 1000; //15 minutes;

                await user.save();

                //---------------- Now we move to send the mail
                const FrontendUrl = process.env.FRONTEND_URL
                const url = `${FrontendUrl}/resetPassword/${resetToken}`;

                const msg = `Click on ${url} to reset your password, if you haven't send, then please ignore this`;

                //Send the mail
                try {
                    await SendMail(user.email, 'Reset Password', msg);

                } catch (error) {
                    // console.log(error);
                }

                return res.status(200).json({ success: true, msg: `Check your mail on ${user.email} to reset password` })

            } catch (error) { return res.status(500).json({ success: false, msg: `${error}` }); }
        },

        //After click on reset token, we reset the password, using POST '/api/user/resetPassword/:token'
        async resetPassword(req, res) {
            try {
                //Get the constraints from the user
                const { password, cpassword } = req.body;
                const { token } = req.params;

                if (password.length < 8 || cpassword.length < 8)
                    return res.status(404).json({ success: false, msg: "Password & Confirm password must be 8 char long" })

                //check password and confirm password match
                if (password !== cpassword) { return res.status(404).json({ success: false, msg: "Password and ConfrimPassword did not match" }) };

                const hashToken = crypto.createHash('sha256').update(token).digest('hex');


                //Find the user in according of the token 
                const user = await UserModel.findOne({ resetPasswordToken: hashToken, resetPasswordTokenTime: { $gt: Date.now() } });

                if (!user) return res.status(401).json({ success: false, msg: 'Token is expires or user is not found' });


                //After finding update the password or can say hash the password
                user.password = await bcrypt.hash(password, 10);

                user.resetPasswordToken = undefined;
                user.resetPasswordTokenTime = undefined

                await user.save();

                return res.status(200).json({ success: true, msg: 'Your password is reset successfully', user });

            } catch (error) { return res.status(500).json({ success: false, msg: error }); }
        }
    }
}


module.exports = AuthControllers;