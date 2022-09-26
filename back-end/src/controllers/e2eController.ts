import { prisma } from "../database.js";
import { Request, Response } from "express";

export default async function resete2eController(req: Request, res: Response) {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
    res.sendStatus(200);
};