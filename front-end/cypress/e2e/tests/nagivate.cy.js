import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/e2e/reset");
  cy.visit('http://localhost:3000')
});

const newRecommendation = () => { 
  return {
    name:faker.lorem.word(),
    link:`https://www.youtube.com/watch?v=_CUyj0yvuaU`
  }
}

describe('testing top screen', () => {

  it('should come back to home', () => {

    cy.get("[data-cy=home]").click();


    cy.get("[data-cy=no-reco]").should("contain", "No recommendations yet! Create your own :)");

  });

  it('should render 10 top recommendations', () => {

    for (let i = 0; i < 11; i++) {
      let recommendation = newRecommendation();
      cy.get("[data-cy=name]").type(recommendation.name);
      cy.get("[data-cy=link]").type(recommendation.link);
      cy.get("[data-cy=button]").click();
    };

    cy.get("[data-cy=top]").click();

    cy.intercept("GET", `/recommendations/top/10`).as("getTopRecommendations");

    cy.get("[data-cy=title]").should("have.length", 10);

  });

  it('should render 1 random recommendation', () => {


    let recommendation = newRecommendation();
    cy.get("[data-cy=name]").type(recommendation.name);
    cy.get("[data-cy=link]").type(recommendation.link);
    cy.get("[data-cy=button]").click();


    cy.get("[data-cy=random]").click();


    cy.get("[data-cy=title]").should("contain", recommendation.name);

  });

})
