import { Model, Sequelize } from "../Config/database.js";
import AuthorRevenue from "./AuthorRevenue.js";

const User = Model.define('users', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM('admin', 'author', 'retail_user'),
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        default: 1,
    }

}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
await User.sync();
AuthorRevenue.belongsTo(User, { sourceKey: "id", foreignKey: 'user_id' })

export default User;