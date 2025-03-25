import { Request, Response } from "express";
import Resource, { IResource } from "../models/Resource";

export const addResource = async (req: Request, res: Response) => {
    try {
        const { type, quantity, location } = req.body;
        const resource: IResource = new Resource({ type, quantity, location, addedBy: req.user.id });

        await resource.save();
        res.status(201).json({ message: "Resource added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getResources = async (req: Request, res: Response) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
