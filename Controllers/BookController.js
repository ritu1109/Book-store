import Validator from "validatorjs";
import Reply from "../Helpers/Reply.js";
import Book from "../models/Books.js";
import Pagination from "../Common/Pagination.js";
import User from "../Models/User.js";
import PurchaseHistory from "../Models/PurchaseHistory.js";
import AuthorRevenue from "../Models/AuthorRevenue.js";
import Mail from "../Common/Mail.js";

async function generatePurchaseID() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const latestEntry = await PurchaseHistory.findOne({
        order: [['created_at', 'DESC']], // Assuming there's a createdAt field to determine the latest entry
        limit: 1,
        attributes: ['id']
      });
    const numericIncrement = latestEntry?latestEntry.id+1:1;

    const purchaseID = `${year}-${month}-${numericIncrement }`;
    return purchaseID;
}
async function generateAuthorRevenue(book_data, quantity) {
    const authors = JSON.parse(book_data.authors);
    const revenue_per_author = parseFloat((book_data.price*quantity)/authors.length).toFixed(2);
    // console.log({'authors.length':authors.length,revenue_per_author})
    const authors_arr = await AuthorRevenue.findAll({
        where:{
            user_id: authors
        },
        include:[{
            model: User,
            attributes:[
                'email',
                'name'
            ]
        }]
    });
    for(let i = 0; i < authors_arr.length; i++){
        const author = authors_arr[i];
        author.total_revenue = parseFloat(author.total_revenue)+ parseFloat(revenue_per_author);
        await author.save();
        const to = author.user.email;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');        
        const message = `Hey ${author.user.name} Congratulations! Your Book is Purchased by a user. Your total revenue till ${month}/${year} is ${author.total_revenue}`;
        const subject = 'Revenue Updated';
        Mail.send(to,message,subject);
    };
}


const publishBook = async (req, res) => {
    var request = req.body;
    let validation = new Validator(request, {
        title: "required",
        description: "required",
        authors: "required",
        price: "required|numeric|min:100|max:1000"
    }, {
        "min.price": "Price should be between 100 and 1000 bucks",
        "max.price": "Price should be between 100 and 1000 bucks"
    });
    if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));

    const book_title_exists = await Book.findOne({
        where: {
            title: request.title
        }
    })
    if (book_title_exists) {
        return res.json(Reply.failed("Book title already exists"));
    }
    const authors = await User.findAll({
        where: {
            id: request.authors,
            role: 'author'
        }
    })
    if (!authors || authors.length != request.authors.length) {
        return res.json(Reply.failed("Select valid authors"))
    }
    request.authors = JSON.stringify(request.authors);

    let slug = request.title.toLowerCase().replace(/ /g, '_');
    const latestEntry = await Book.findOne({
        order: [['created_at', 'DESC']], // there's a createdAt field to determine the latest entry
        attributes: ['id']
      });
      const last_id = latestEntry?latestEntry.id:0
    request.slug = slug;
    request.book_id = 'book-' + (last_id + 1);
    try {
        await Book.create(request);
        return res.json(Reply.success("Book Published successfully"));


    } catch (err) {
        console.log(err);
        return res.json(Reply.failed("error", err));
    }
}
const getBooks = async (req, res) => {
    const slug = req.query?.slug;
    var book_data;
    if (slug) {
        book_data = await Book.findOne({
            where: {
                slug: slug
            }
        })
        if (!book_data) return res.json(Reply.failed("Couldn't find the book"))
    } else {
        const pagination = Pagination.getPaginate(req, "id");
        const { count, rows } = await Book.findAndCountAll()
        book_data = Pagination.paginate(
            pagination.page,
            rows,
            pagination.limit,
            count
        );
    }
    return res.json(Reply.success("Data Fetched Successfully", book_data));
}
const purchaseBook = async (req, res) => {
    var request = req.body;
    let validation = new Validator(request, {
        book_id: "required",
        quantity: "required"
    });
    if (validation.fails()) return res.json(Reply.failed(Reply.firstError(validation)));
    const book_data = await Book.findOne({
        where: {
            book_id: request.book_id
        }
    })
    if (!book_data) return res.json(Reply.failed("Couldn't find the book"));
    const purchase_id = await generatePurchaseID();

    try {
        const purchase = await PurchaseHistory.create({
            book_id: book_data.book_id,
            purchase_id: purchase_id,
            user_id: req.user.id,
            price: book_data.price,
            quantity: request.quantity
        });
        book_data.sellcount = parseInt(book_data.sellcount) + parseInt(request.quantity);
        await book_data.save();
        if(purchase){
            await generateAuthorRevenue(book_data, request.quantity);
        }
        return res.json(Reply.success("Order Placed successfully"));
    } catch (err) {
        console.log(err);
        return res.json(Reply.failed("error", err));
    }
}
const purchaseBookHistory = async(req, res) => {
    const user_id = req.user.id;
    const purchase_history = await PurchaseHistory.findAll({
        where: {
            user_id: user_id
        }
    });
    return res.json(Reply.success("Order Placed successfully", purchase_history));
}


export default {
    publishBook,
    getBooks,
    purchaseBook,
    purchaseBookHistory
}