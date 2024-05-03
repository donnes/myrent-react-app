/// <reference types="cypress" />

describe("Search", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("should search by destination and dates range", () => {
    // Select New York
    cy.get("input[placeholder='New York']").type("New York");
    cy.get("[data-value='New York, New York, USA']").click();

    // Select a date range
    cy.get("span").contains("Check in - Check out").closest("label").click();
    cy.get("button[name='day']").contains("10").click();
    cy.get("button[name='day']").contains("17").click();

    // Search
    cy.get("button[type='submit']").click();

    // Grid should contain 2 children
    cy.get("div[class^='grid']").children().should("have.length", 2);
  });

  it("should search by destination, dates range and guests", () => {
    // Select New York
    cy.get("input[placeholder='New York']").type("Miami");
    cy.get("[data-value='Miami, Florida, USA']").click();

    // Select a date range
    cy.get("span").contains("Check in - Check out").closest("label").click();
    cy.get("button[name='day']").contains("10").click();
    cy.get("button[name='day']").contains("17").click();

    // Select 3 guests
    cy.get("input[type='number']").type("3");

    // Search
    cy.get("button[type='submit']").click();

    // Grid should contain 1 children
    cy.get("div[class^='grid']").children().should("have.length", 1);
  });
});
