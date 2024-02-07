import { Model, Sequelize } from "../config/database.js";

const PurchaseHistory = Model.define('purchase_history', {
    book_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    purchase_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL(),
        allowNull: false
    },
    quantity: {
        type: Sequelize.BIGINT(20),
        allowNull: false
    }

}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
await PurchaseHistory.sync();


export default PurchaseHistory;