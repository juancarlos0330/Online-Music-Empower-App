import * as express from 'express';

const router = express.Router();

router.get('*', (req, res) => {
    res.redirect('/');
});

router.all('*', (req, res) => {
    res.status(404).end();
});

export default router;