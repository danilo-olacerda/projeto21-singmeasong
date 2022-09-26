import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/e2e/reset");
  cy.visit('http://localhost:3000')
});

const newRecommendation = {
  name:faker.lorem.word(),
  link:`https://www.youtube.com/watch?v=_CUyj0yvuaU`
}

describe('testing main screen', () => {

  it('creates a new recommendation', () => {

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.intercept("POST", "/recommendations").as("postRecommendations");

    cy.get("[data-cy=name]").type(newRecommendation.name);
    cy.get("[data-cy=link]").type(newRecommendation.link);

    cy.get("[data-cy=button]").click();

    cy.wait("@postRecommendations");
    cy.wait("@getRecommendations");

    cy.get("[data-cy=title]").should("contain", newRecommendation.name);
    cy.get("[data-cy=preview]").should("be.visible");

  });

  it('should not create a new recommendation', () => {

    const recommendation = newRecommendation;;

    cy.get("[data-cy=name]").type(recommendation.name);
    cy.get("[data-cy=link]").type("https://google.com");

    cy.get("[data-cy=button]").click();

    cy.get(recommendation.name).should("not.exist");

  });

})
