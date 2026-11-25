
describe('Portfolio Contact Form - E2E', () => {
  it('submits a contact message successfully', () => {
    cy.intercept('POST', '**/api/contacts').as('submitContact')

    cy.visit('/contact')

    cy.contains('h1', 'Contact Me').should('be.visible')

    cy.get('#firstName').type('Cypress')
    cy.get('#lastName').type('Test')
    cy.get('#phone').type('6135550100')
    cy.get('#email').type('cypress@example.com')
    cy.get('#message').type(
      'Automated end-to-end test for Assignment 4.'
    )

    cy.screenshot('Contact_Form_Completed')

    const alertStub = cy.stub()

    cy.on('window:alert', alertStub)

    cy.contains('button', 'Send Message').click()

    cy.wait('@submitContact').then(({ request, response }) => {
      expect(response.statusCode).to.be.oneOf([200, 201])

      expect(request.body).to.include({
        firstName: 'Cypress',
        lastName: 'Test',
        email: 'cypress@example.com',
        message: 'Automated end-to-end test for Assignment 4.'
      })
    })

    cy.wrap(alertStub).should(
      'have.been.calledWith',
      'Thank you, Cypress! Your message has been received.'
    )

    cy.location('pathname').should('eq', '/')

    cy.screenshot('Contact_Submission_Success')
  })
})
