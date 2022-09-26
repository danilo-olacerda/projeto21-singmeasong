import app from "../../src/app";
import supertest from "supertest";
import * as repo from "../../src/repositories/recommendationRepository";
import { prisma } from "../../src/database";
import * as factory from "../factory/recomendationsFactory";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

afterAll(async () => {
    await prisma.$disconnect();
});

const agent = supertest(app);

describe("POST /recommendations", () => {

    it("should answer with status 201 for valid params and create a new recommendation", async () => {

        const body = factory.recomendationsFactory();

        const response = await agent.post("/recommendations").send(body);

        expect(response.status).toEqual(201);
        expect(response.body).toEqual({id: 1, name: body.name, youtubeLink: body.youtubeLink, score: 0});

    });

});