/// <reference types="cypress" />

import { bookings } from "../fixtures/bookings";

const mockGlobalStore = {
  state: {
    bookings,
  },
  version: 0,
};

describe("Bookings", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/bookings", {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          "global-storage",
          JSON.stringify(mockGlobalStore),
        );
      },
    });
  });

  it('should display two sections "Incoming Bookings" and "Past Bookings"', () => {
    cy.get("h2").contains("Incoming Bookings").should("exist");

    cy.get("h2").contains("Past Bookings").should("exist");
  });

  it("should cancel a reservation", () => {
    // Find the first incoming booking
    cy.get(".grid").first().children("div").first().find("button").click();

    // Click the "Cancel" button
    cy.get("[role='menuitem']").contains("Cancel").click();

    // Check if the cancel alert is displayed
    cy.get("div").contains("Are you absolutely sure?").should("exist");
    cy.get("button").contains("Confirm").click();

    // Check if the reservation is canceled
    cy.get("div")
      .contains("Your reservation has been canceled!")
      .should("exist");

    // Check if the reservation is removed from the list
    cy.get("h2")
      .contains("Incoming Bookings")
      .next("div.grid")
      .children()
      .should("not.contain.text", "Central Park Loft")
      .should("have.length", 1);
  });

  it("should not allow edit a reservation with overlapping dates", () => {
    // Find the first incoming booking
    cy.get(".grid").first().children("div").first().find("button").click();

    // Click the "Edit" button
    cy.get("[role='menuitem']").contains("Edit").click();

    // Check if the edit dialog is displayed
    cy.get("button").contains("Update Booking").should("exist");

    // Select a date range
    cy.get("span").contains("Check in - Check out").closest("label").click();
    cy.get("button[name='day']").contains("15").first().click();

    // Close the date range
    cy.get("span").contains("Check in - Check out").closest("label").click();

    // Submit
    cy.get("button").contains("Update Booking").click();
    cy.get("div").contains("Date range already booked.").should("exist");
  });

  it("should edit a reservation", () => {
    // Find the first incoming booking
    cy.get(".grid").first().children("div").first().find("button").click();

    // Click the "Edit" button
    cy.get("[role='menuitem']").contains("Edit").click();

    // Check if the edit dialog is displayed
    cy.get("button").contains("Update Booking").should("exist");

    // Select a date range
    cy.get("span").contains("Check in - Check out").closest("label").click();
    cy.get("button[name='day']").contains("10").first().click();
    cy.get("button[name='day']").contains("10").first().click();
    cy.get("button[name='day']").contains("12").first().click();

    // Close the date range
    cy.get("span").contains("Check in - Check out").closest("label").click();

    // Select 10 guests
    cy.get("input[type='number']").type("10");

    // Check subtotal price
    cy.get("li>data").first().should("contain.value", 300);

    // Check extra guests fee
    cy.get("li>data").last().should("contain.value", 50);

    // Check total price
    cy.get("span")
      .contains("Total")
      .parent()
      .children("data")
      .should("contain.value", 350);

    // Submit
    cy.get("button").contains("Update Booking").click();
    cy.get("div")
      .contains("Your reservation has been updated successfully!")
      .should("exist");
  });
});
