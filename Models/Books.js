import { Model, Sequelize } from "../Config/database.js";

const Book = Model.define('books', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    book_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    authors: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DECIMAL(6,2),
        allowNull: false
    },
    sellcount: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        defaultValue:0
    }

}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
await Book.sync();


export default Book;