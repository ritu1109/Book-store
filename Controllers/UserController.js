import Reply from "../Helpers/Reply.js"
import User from "../Models/User.js"
import Validator from "validatorjs";
import bcrypt from 'bcrypt'
import _ from "lodash"
import dotenv from "dotenv";
import JWT from 'jsonwebtoken';
import Mail from "../Common/Mail.js";
import Token from "../Models/Token.js";
import OTP from "../Models/Otp.js";
import AuthorRevenue from "../Models/AuthorRevenue.js";


dotenv.config();

const SALT = process.env.PASSWORD_SALT;

const register = async (req, res) => {
  let request = req.body;
  let validation = new Validator(request, {
    name: "required",
    email: "required|email",
    password: "required",
    role: "required|in:admin,author,retail_user"
  }, {
    "required.email": "Without an :attribute we can't reach you!",
    "in.role": "Role can be one either author or retail_user"
  });

  if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));
  const email_exists = await User.findOne({
    where: {
      email: request.email
    }
  });
  if (email_exists){ return res.json(Reply.failed("Email already exists"));}

  let hashed_password = bcrypt.hashSync(request.password, SALT);
  request.password = hashed_password;
  
  try {
    let user = await User.create(request);
    console.log({ user });
    if(request.role=="author"){
      await AuthorRevenue.create({
        user_id: user.id
      })
    }
    return res.json(Reply.success("Registration success"));


  } catch (err) {
    return res.json(Reply.failed("error", err));
  }


}



const login = async (req, res) => {

  let request = req.body;
  let validation = new Validator(request, {
    'email': 'required|email',
    'password': 'required'
  });

  if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));

  let user = await User.findOne({
    where: {
      email: request.email
    }
  });

  if (!user){return res.json(Reply.failed('Invalid login credentials'));}
  let pass_wrd = await bcrypt.compare(request.password, user.password);
  
  if (!pass_wrd) return res.json(Reply.failed('Invalid login credentials'));

  const JTI = Date.now();
  let data = { user_id: user.id, email: user.email, jti: JTI };

  const TOKEN = JWT.sign(data, process.env.JWT_KEY, { expiresIn: "24h" });

  let user_data = { 'token': TOKEN };
  await Token.create({ user_id: user.id, token: TOKEN, jti: JTI })
  return res.json(Reply.success('User login Successfully', user_data));
}


//forgetPassword..
const forgetPassword = async (req, res) => {

  let request = req.body;

  let validation = new Validator(request, {
    'email': 'required|email',
  });

  if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));

  let existance = await User.findOne({
    where:{
      email: request.email
    }
  })

  if (!existance) {
    return res.json(Reply.failed('Invalid Email ID'));
  }

  let otp = Math.floor(100000 + Math.random() * 900000);

  let data = {
    email: existance.email,
    otp: otp,
  }

  let forget_otp = {};
  let update_otp = await OTP.findOne({
    where: {
      email: data.email
    }
  });
  if (!update_otp) {
    forget_otp = await OTP.create(data);
  } else {
    forget_otp = await OTP.update(data, {
      where: {
        email: data.email
      }
    })
  }

  if (!forget_otp) {
    return res.json(Reply.failed("Server Error Please Try After Some"));

  }

  Mail.send(data.email, "Your OTP To Reset Password " + data.otp);

  return res.json(Reply.success('mail has successfully sent on this mail id ' + data.email));

}
//OTP VERIFICATION..
const otpVerification = async (req, res) => {
  let request = req.body;
  let validation = new Validator(request, {
    'otp': 'required|size:6',
  });

  if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));

  let otp_verify = await OTP.findOne({
    where: {
      otp: request.otp,
      email: request.email
    }
  });

  if (!otp_verify) {
    return res.json(Reply.failed('Invalid OTP'));
  }

  return res.json(Reply.success('OTP Verify Successfully'));
}

const resetPassword = async (req, res) => {

  let request = req.body;
  let validation = new Validator(request, {
    newPassword: [
      "required",
      "min:4",
    ],
    confirm_password: ["required", "same:newPassword"],
  });

  if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));

  let otp_verify = await OTP.findOne({
    where: {
      otp: request.otp,
      email: request.email
    }
  });

  if (!otp_verify) {
    return res.json(Reply.failed('Invalid User'));
  }

  let password = bcrypt.hashSync(request.newPassword, SALT);
  request.newPassword = password;

  await User.update({
    password: request.newPassword
  }, {
    where: {
      email: request.email
    }
  });

  return res.json(Reply.success("password updated successfully"));
}






const hardlogout = async (req, res) => {
  let result = await Token.destroy({ where: { user_id: req.user.id } });
  return res.json(Reply.success("Logout From All Devices Successfully", result));

}
const logout = async (req, res) => {
  let result = await Token.destroy({ where: { user_id: req.user.id, token: req.header('Authorization')?.split(' ')[1] } });
  return res.json(Reply.success("Logout Successfully", result));

}




export default {
  register,
  login,
  resetPassword,
  logout,
  hardlogout,
  forgetPassword,
  otpVerification
}
