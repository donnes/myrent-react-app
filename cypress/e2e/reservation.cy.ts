/// <reference types="cypress" />

import { addDays } from "date-fns";

const mockGlobalStore = {
  state: {
    bookings: [
      {
        id: "1f92c443-73a2-4889-bfe9-1033b4eb984b",
        property: {
          id: "920e47e4-a831-4b75-81f2-3f155e81f907",
          title: "Sunny Orlando Retreat",
          description:
            "A family-friendly home near Disney World with a private pool.",
          image:
            "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb",
          pricePerNight: 120,
          amenities: {
            wifi: true,
            pool: true,
            parking: true,
            airConditioning: true,
            oceanView: false,
            hotTub: false,
            gym: false,
            petFriendly: true,
            kitchen: true,
            washer: false,
            fireplace: false,
            privateGarden: false,
          },
          rating: 4.5,
          reviews: 200,
          guests: 8,
          bedrooms: 4,
          bathrooms: 2.5,
          location: { city: "Orlando", state: "Florida", country: "USA" },
        },
        dates: {
          from: addDays(new Date(), 1).toISOString(),
          to: addDays(new Date(), 7).toISOString(),
        },
        guests: 1,
        totalPrice: 720,
      },
    ],
  },
  version: 0,
};

describe("Reservation", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/properties/920e47e4-a831-4b75-81f2-3f155e81f907",
      {
        onBeforeLoad: function (window) {
          window.localStorage.setItem(
            "global-storage",
            JSON.stringify(mockGlobalStore),
          );
        },
      },
    );
  });

  it("should not allow make a reservation with overlapping dates", () => {
    cy.get("button").contains("Reserve").click();
    cy.get("div").contains("Date range already booked.").should("exist");
  });

  it("should make a reservation with the given dates", () => {
    // Select a date range
    cy.get("span").contains("Check in - Check out").closest("label").click();
    cy.get("button[name='day']").contains("17").first().click();
    cy.get("button[name='day']").contains("17").first().click();
    cy.get("button[name='day']").contains("23").first().click();

    // Close the date range
    cy.get("span").contains("Check in - Check out").closest("label").click();

    // Check total price
    cy.get("span")
      .contains("Total")
      .parent()
      .children("data")
      .should("contain.value", 720);

    // Make the reservation
    cy.get("button").contains("Reserve").click();
    cy.get("div")
      .contains("Your reservation has been booked successfully!")
      .should("exist");
  });

  it("should make a reservation with the given dates and fee for extra guests", () => {
    // Select a date range
    cy.get("span").contains("Check in - Check out").closest("label").click();
    cy.get("button[name='day']").contains("10").first().click();
    cy.get("button[name='day']").contains("10").first().click();
    cy.get("button[name='day']").contains("20").first().click();

    // Close the date range
    cy.get("span").contains("Check in - Check out").closest("label").click();

    // Select 10 guests
    cy.get("input[type='number']").type("10");

    // Check subtotal price
    cy.get("li>data").first().should("contain.value", 1200);

    // Check extra guests fee
    cy.get("li>data").last().should("contain.value", 20);

    // Check total price
    cy.get("span")
      .contains("Total")
      .parent()
      .children("data")
      .should("contain.value", 1220);

    // Make the reservation
    cy.get("button").contains("Reserve").click();
    cy.get("div")
      .contains("Your reservation has been booked successfully!")
      .should("exist");
  });
});
