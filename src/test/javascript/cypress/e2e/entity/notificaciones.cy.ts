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

describe('Notificaciones e2e test', () => {
  const notificacionesPageUrl = '/notificaciones';
  const notificacionesPageUrlPattern = new RegExp('/notificaciones(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notificacionesSample = {};

  let notificaciones;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/notificaciones+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/notificaciones').as('postEntityRequest');
    cy.intercept('DELETE', '/api/notificaciones/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notificaciones) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/notificaciones/${notificaciones.id}`,
      }).then(() => {
        notificaciones = undefined;
      });
    }
  });

  it('Notificaciones menu should load Notificaciones page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('notificaciones');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Notificaciones').should('exist');
    cy.url().should('match', notificacionesPageUrlPattern);
  });

  describe('Notificaciones page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notificacionesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Notificaciones page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/notificaciones/new$'));
        cy.getEntityCreateUpdateHeading('Notificaciones');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', notificacionesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/notificaciones',
          body: notificacionesSample,
        }).then(({ body }) => {
          notificaciones = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/notificaciones+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [notificaciones],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(notificacionesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Notificaciones page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notificaciones');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', notificacionesPageUrlPattern);
      });

      it('edit button click should load edit Notificaciones page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Notificaciones');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', notificacionesPageUrlPattern);
      });

      it('edit button click should load edit Notificaciones page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Notificaciones');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', notificacionesPageUrlPattern);
      });

      it('last delete button click should delete instance of Notificaciones', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('notificaciones').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', notificacionesPageUrlPattern);

        notificaciones = undefined;
      });
    });
  });

  describe('new Notificaciones page', () => {
    beforeEach(() => {
      cy.visit(`${notificacionesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Notificaciones');
    });

    it('should create an instance of Notificaciones', () => {
      cy.get(`[data-cy="tipoNotificacion"]`).type('users web').should('have.value', 'users web');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        notificaciones = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', notificacionesPageUrlPattern);
    });
  });
});
