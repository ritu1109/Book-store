import express from 'express';
import Authenticate from '../Middleware/Authenticate.js';
import BookController from "../Controllers/BookController.js";



const router = express.Router();


/*################### Auth Routes ############################*/
router.post('/publish', Authenticate.authorAuthenticate,  BookController.publishBook);
router.get('/get', Authenticate.userAuthenticate, BookController.getBooks);
router.post('/purchase', Authenticate.userAuthenticate, BookController.purchaseBook);
router.post('/purchase-history', Authenticate.userAuthenticate, BookController.purchaseBookHistory);

export default router;

