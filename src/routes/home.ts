import * as express from 'express';
import { B2Service } from '../services/b2.service';

const router = express.Router();

router.get('/', async (req, res) => {
    const b2Data = await new B2Service().getData();

    res.render('home', { 
        categories: b2Data.categories,
        categoriesBase64: Buffer.from(JSON.stringify(b2Data.categories)).toString('base64'),
        stock: b2Data.stock
    });
});

export default router;