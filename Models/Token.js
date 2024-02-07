import { Model, Sequelize } from "../Config/database.js";

const Token = Model.define('tokens',{

    user_id: {
        type:Sequelize.STRING,
        allowNull: false
      },
      jti: {
        type:Sequelize.STRING,
        allowNull: false
      },
      token: {
        type:Sequelize.TEXT,
        allowNull: false
      }
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
await Token.sync();
export default Token ;
 


