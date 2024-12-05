import express from 'express';
import { FlatController } from '../controllers/FlatController';

const router = express.Router();
const flatController = new FlatController();

router.get('/flats', flatController.getFlats);
router.post('/addflat', (req, res)=> flatController.addFlat(req,res));


export default router;

