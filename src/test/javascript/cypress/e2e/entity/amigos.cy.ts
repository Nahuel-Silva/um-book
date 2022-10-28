import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Amigos e2e test', () => {
  const amigosPageUrl = '/amigos';
  const amigosPageUrlPattern = new RegExp('/amigos(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const amigosSample = {};

  let amigos;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/amigos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/amigos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/amigos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (amigos) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/amigos/${amigos.id}`,
      }).then(() => {
        amigos = undefined;
      });
    }
  });

  it('Amigos menu should load Amigos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('amigos');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Amigos').should('exist');
    cy.url().should('match', amigosPageUrlPattern);
  });

  describe('Amigos page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(amigosPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Amigos page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/amigos/new$'));
        cy.getEntityCreateUpdateHeading('Amigos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', amigosPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/amigos',
          body: amigosSample,
        }).then(({ body }) => {
          amigos = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/amigos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [amigos],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(amigosPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Amigos page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('amigos');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', amigosPageUrlPattern);
      });

      it('edit button click should load edit Amigos page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Amigos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', amigosPageUrlPattern);
      });

      it('edit button click should load edit Amigos page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Amigos');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', amigosPageUrlPattern);
      });

      it('last delete button click should delete instance of Amigos', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('amigos').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', amigosPageUrlPattern);

        amigos = undefined;
      });
    });
  });

  describe('new Amigos page', () => {
    beforeEach(() => {
      cy.visit(`${amigosPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Amigos');
    });

    it('should create an instance of Amigos', () => {
      cy.get(`[data-cy="cantidad"]`).type('21242').should('have.value', '21242');

      cy.get(`[data-cy="amigosComun"]`).type('Vía hacking Relacciones').should('have.value', 'Vía hacking Relacciones');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        amigos = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', amigosPageUrlPattern);
    });
  });
});
