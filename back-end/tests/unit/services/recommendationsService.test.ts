import { recommendationRepository as repo} from "../../../src/repositories/recommendationRepository";
import { recommendationService as service} from "../../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import { prisma } from "../../../src/database";
import * as factory from "../../factory/recomendationsFactory";

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("create recommendations service", () => {

    it("should call create and findByName functions", async () => {
        const spyCreate = jest.spyOn(repo, "create");
        const spyFindByName = jest.spyOn(repo, "findByName");

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);

        expect(spyCreate).toBeCalledTimes(1);
        expect(spyFindByName).toBeCalledTimes(1);
    });

    it("should return error 409 for 2 valids params and create a single new recommendation", async () => {
        const spyCreate = jest.spyOn(repo, "create");
        const spyFindByName = jest.spyOn(repo, "findByName").mockImplementationOnce((): any => {
            return recommendation;
        });

        const recommendation = factory.recomendationsFactory();
        await repo.create(recommendation);
        const result = service.insert(recommendation);

        expect(spyCreate).toBeCalledTimes(1);
        expect(spyFindByName).toBeCalledTimes(1);
        expect(result).rejects.toEqual({ type: "conflict", message: "Recommendations names must be unique" });
    });

});

describe("recommendations upvote service", () => {

    it("should increment score", async () => {

        const spyIncrementScore = jest.spyOn(repo, "updateScore");

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        await service.upvote(1);

        expect(spyIncrementScore).toBeCalledTimes(1);

    });

    it("should answer with error 404 for invalid id and not increment score", async () => {

        const spyIncrementScore = jest.spyOn(repo, "updateScore");

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        const result = service.upvote(2);

        expect(spyIncrementScore).toBeCalledTimes(0);
        expect(result).rejects.toEqual({ type: "not_found", message: "" });

    });

});

describe("recommendations downvote service", () => {

    it("should decrement score", async () => {

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        jest.spyOn(repo, "find").mockImplementationOnce((): any => {
            return recommendation
        });

        jest.spyOn(repo, "updateScore").mockImplementationOnce((): any => {
            return recommendation
        });

        await service.downvote(1);

        expect(repo.find).toBeCalledTimes(1);
        expect(repo.updateScore).toBeCalledTimes(1);

    });

    it("should answer with error 404 for invalid id and not decrement score", async () => {

        const spyDecrementScore = jest.spyOn(repo, "updateScore");

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        const result = service.downvote(1000);

        expect(spyDecrementScore).toBeCalledTimes(0);
        expect(result).rejects.toEqual({ type: "not_found", message: "" });

    });

    it("should delete a recommendation with less than -5 of score", async () => {

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);

        for (let i = 0; i < 5; i++) {
            await repo.updateScore(1, "decrement");
        }

        const response = service.downvote(1);

        expect(response).rejects.toEqual({ type: "not_found", message: "" });

    });

});

describe("get recommendations service", () => {

    it("should answer with all recommendations", async () => {

        const recommendations = factory.recomendationsFactoryArray(10);

        jest.spyOn(repo, "findAll");
        
        for (let i = 0; i < recommendations.length; i++) {
            await service.insert(recommendations[i]);
            if (i === recommendations.length - 1) {
                await service.get();
            }
        }

        expect(repo.findAll).toBeCalledTimes(1);

    });

});

describe("get recommendations by id service", () => {

    it("should call find by id function", async () => {

        const spyFindById = jest.spyOn(repo, "find").mockImplementationOnce((): any => {
            return recommendation
        });

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        await service.getById(1);

        expect(spyFindById).toBeCalled();

    });

    it("should call find by if function and return not found", async () => {

        const spyFindById = jest.spyOn(repo, "find");

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        const result = service.getById(2);

        expect(spyFindById).toBeCalled();
        expect(result).rejects.toEqual({ type: "not_found", message: "" });

    });

});

describe("get recommendations random service", () => {

    it("should return a random recommendation", async () => {

        const recommendation = factory.recomendationsFactory();
        await service.insert(recommendation);
        
        jest.spyOn(Math, 'random').mockImplementationOnce((): number => {
            return Math.random();
        });

        jest.spyOn(repo, "findAll").mockImplementationOnce((): any => {
            return [recommendation, recommendation];
        });

        const result = await service.getRandom();

        expect(result).toEqual(recommendation);
        expect(repo.findAll).toBeCalledTimes(1);

    });

});

describe("get recommendations top with amount service", () => {

    it("should call the getAmountByScore function", async () => {

        jest.spyOn(repo, "getAmountByScore").mockImplementationOnce((): any => {});

        await service.getTop(10);

        expect(repo.getAmountByScore).toBeCalledTimes(1);

    });

});