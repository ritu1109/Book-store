import { Model, Sequelize } from "../Config/database.js";

const OTP = Model.define('forget_tokens', {
   
    sponser_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false

    },
    otp: {
        type: Sequelize.STRING,
        allowNull: false,
       

    },
    expired_at:{
        type: Sequelize.STRING,
        allowNull: true,
        
    }


}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
await OTP.sync();

export default OTP; 