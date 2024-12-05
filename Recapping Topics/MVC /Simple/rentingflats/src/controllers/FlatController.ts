import { Request, Response } from "express";
import { FlatModel } from "../models/Flat";

const flatModel = new FlatModel();

export class FlatController{
    getFlats(req: Request, res: Response){
        const flats = flatModel.getAllFlats();
        res.status(200).json(flats);
    }

    addFlat(req: Request, res: Response){
        const newFlat = req.body;
        const addedFlat = flatModel.addFlat(newFlat);
        res.status(201).json(addedFlat);
    }
}