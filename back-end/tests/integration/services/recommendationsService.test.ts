import app from "../../../src/app";
import supertest from "supertest";
import { recommendationRepository as repo} from "../../../src/repositories/recommendationRepository";
import { prisma } from "../../../src/database";
import * as factory from "../../factory/recomendationsFactory";

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

        const recommendation = await repo.findByName(body.name);

        expect(response.status).toEqual(201);
        expect(recommendation).toEqual({"id": 1, "name": body.name, "score": 0, "youtubeLink": "https://youtu.be/4Ukh9aQBzWc"})

    });

    it("should answer with status 422 for invalid params and not create a new recommendation", async () => {

        const body = factory.recomendationsFactory();

        delete body.name;

        const response = await agent.post("/recommendations").send(body);

        const recommendation = await repo.findAll();

        expect(response.status).toEqual(422);
        expect(recommendation).toEqual([]);

    });

    it("should answer with status 409 for  2 valids params and create a single new recommendation", async () => {

        const body = factory.recomendationsFactory();

        await agent.post("/recommendations").send(body);
        const response = await agent.post("/recommendations").send(body);

        const recommendation = await repo.findAll();

        expect(response.status).toEqual(409);
        expect(recommendation).toHaveLength(1);

    });

});

describe("POST /recommendations/:id/upvote", () => {

    it("should answer with status 200 for valid params and increment score", async () => {

        const body = factory.recomendationsFactory();

        await agent.post("/recommendations").send(body);

        const response = await agent.post("/recommendations/1/upvote");

        const recommendation = await repo.find(1);

        expect(response.status).toEqual(200);
        expect(recommendation.score).toEqual(1);

    });

    it("should answer with status 404 for invalid params and not increment score", async () => {

        const response = await agent.post("/recommendations/1/upvote");

        expect(response.status).toEqual(404);

    });

});

describe("POST /recommendations/:id/downvote", () => {

    it("should answer with status 200 for valid params and decrement score", async () => {

        const body = factory.recomendationsFactory();

        await agent.post("/recommendations").send(body);

        const response = await agent.post("/recommendations/1/downvote");

        const recommendation = await repo.find(1);

        expect(response.status).toEqual(200);
        expect(recommendation.score).toEqual(-1);

    });

    it("should answer with status 404 for invalid params and not decrement score", async () => {
            
        const response = await agent.post("/recommendations/1/downvote");
    
        expect(response.status).toEqual(404);
    
    });

    it("should answer with status 200 for valid params and delete recommendation", async () => {

        const body = factory.recomendationsFactory();

        await agent.post("/recommendations").send(body);

        for (let i = 0; i < 6; i++) {
            await agent.post("/recommendations/1/downvote");
        }

        const recommendation = await repo.find(1);

        expect(recommendation).toBeNull();

    });

});

describe("GET /recommendations", () => {

    it("should answer with status 200 and return all recommendations (max 10)", async () => {

        const bodys = factory.recomendationsFactoryArray(11);

        for (let body of bodys) {
            await agent.post("/recommendations").send(body);
        }

        const response = await agent.get("/recommendations");

        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(10);

    });

});

describe("GET /recommendations/:id", () => {

    it("should answer with status 200 and return a recommendation", async () => {

        const body = factory.recomendationsFactory();

        await agent.post("/recommendations").send(body);

        const response = await agent.get("/recommendations/1");

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({"id": 1, "name": body.name, "score": 0, "youtubeLink": "https://youtu.be/4Ukh9aQBzWc"});

    });

    it("should answer with status 404 for invalid params and not return a recommendation", async () => {

        const response = await agent.get("/recommendations/1");

        expect(response.status).toEqual(404);

    });;

});

describe("GET /recommendations/random", () => {

    it("should answer with status 200 and return a random recommendation", async () => {

        const bodys = factory.recomendationsFactoryArray(10);

        for (let body of bodys) {
            await agent.post("/recommendations").send(body);
        }

        const response = await agent.get("/recommendations/random");

        expect(response.status).toEqual(200);

    });

    it("should answer with status 404 if there is not recommendations", async () => {

        const response = await agent.get("/recommendations/random");

        expect(response.status).toEqual(404);

    });

});

describe("GET /recommendations/top/:amount", () => {

    it("should answer with status 200 and return the top 5 recommendations", async () => {

        const bodys = factory.recomendationsFactoryArray(10);

        for (let body of bodys) {
            await agent.post("/recommendations").send(body);
        }

        const response = await agent.get("/recommendations/top/5");

        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(5);

    });

    it("should answer with status 200 if there is not recommendations and return array of length 0", async () => {

        const response = await agent.get("/recommendations/top/5");

        expect(response.status).toEqual(200);

        expect(response.body).toHaveLength(0);

    });

});