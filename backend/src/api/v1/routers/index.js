const Routers = require('express').Router();


//--------------------------- Middlewares Specific Stuff ---------------------------------X
const FetchUser = require('../middlewares/FetchUser'); //fetch user by the token

//------------------ Controllers Specific Stuff-------------------------X
const AuthControllers = require('../controllers/AuthControllers');


//----------------------- INitizlalzing auth apis's routes here -------------------X
Routers.post('/register', AuthControllers().Register); //Register the users ,using POST '/api/user/register'
Routers.post('/login', AuthControllers().Login); //login the users ,using POST '/api/user/login'
Routers.get('/getUser', FetchUser, AuthControllers().getUser); //get info of login users ,using GET '/api/user/getUser'

// Routers.put('/changePassword', FetchUser, AuthControllers().changePassword); //Change the password in basis of old password is correct, using PUT '/api/user/changePassword'
// Routers.put('/updateProfile', FetchUser, AuthControllers().updateProfile); //Update the user profile like name,email,dp etc, using PUT '/api/user/updateProfile'
// Routers.put('/updatePicture', FetchUser, UploadFile, AuthControllers().updatePicture); //Update the user profile like name,email,dp etc, using PUT '/api/user/updatePicture'

//Auth controllers routes is connect in between
Routers.post('/forgetPassword', AuthControllers().forgetPassword); //To forget the password send the mail of register emails, using POST '/api/user/forgetPassword'
Routers.put('/resetPassword/:token', AuthControllers().resetPassword); //Through the mail, check reset password token and reset the password of the user, using POST '/api/user/resetPassword/token'


module.exports = Routers