import { Model, Sequelize } from "../Config/database.js";

const AuthorRevenue = Model.define('author_revenue', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false
    },
    total_revenue:{
        type: Sequelize.DECIMAL(20),
        defaultValue:0 
    }

}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
await AuthorRevenue.sync();


export default AuthorRevenue;