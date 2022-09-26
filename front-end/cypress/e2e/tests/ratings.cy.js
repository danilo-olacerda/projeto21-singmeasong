import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/e2e/reset");
  cy.visit("http://localhost:3000")
});

const newRecommendation = {
  name: faker.lorem.word(),
  link: `https://www.youtube.com/watch?v=_CUyj0yvuaU`
};

describe("testing main screen", () => {

  it("should upvote a new recommendation", () => {

    cy.get("[data-cy=name]").type(newRecommendation.name);
    cy.get("[data-cy=link]").type(newRecommendation.link);

    cy.get("[data-cy=button]").click();

    cy.get("[data-cy=upvote]").click();
    
    cy.get("[data-cy=score]").should("contain","1");

  });

  it("should downvote a new recommendation", () => {

    cy.get("[data-cy=name]").type(newRecommendation.name);
    cy.get("[data-cy=link]").type(newRecommendation.link);

    cy.get("[data-cy=button]").click();

    cy.get("[data-cy=downvote]").click();
    
    cy.get("[data-cy=score]").should("contain","-1");

  });

  it("should delete a new recommendation if has 6 downvotes", () => {

    cy.get("[data-cy=name]").type(newRecommendation.name);
    cy.get("[data-cy=link]").type(newRecommendation.link);

    cy.get("[data-cy=button]").click();

    for (let i=0; i<6; i++) {
      cy.get("[data-cy=downvote]").click();
    }
    
    cy.get("[data-cy=title]").should("not.exist");

  });

})
