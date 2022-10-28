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

describe('Perfil e2e test', () => {
  const perfilPageUrl = '/perfil';
  const perfilPageUrlPattern = new RegExp('/perfil(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const perfilSample = {};

  let perfil;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/perfils+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/perfils').as('postEntityRequest');
    cy.intercept('DELETE', '/api/perfils/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (perfil) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/perfils/${perfil.id}`,
      }).then(() => {
        perfil = undefined;
      });
    }
  });

  it('Perfils menu should load Perfils page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('perfil');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Perfil').should('exist');
    cy.url().should('match', perfilPageUrlPattern);
  });

  describe('Perfil page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(perfilPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Perfil page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/perfil/new$'));
        cy.getEntityCreateUpdateHeading('Perfil');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', perfilPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/perfils',
          body: perfilSample,
        }).then(({ body }) => {
          perfil = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/perfils+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [perfil],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(perfilPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Perfil page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('perfil');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', perfilPageUrlPattern);
      });

      it('edit button click should load edit Perfil page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Perfil');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', perfilPageUrlPattern);
      });

      it('edit button click should load edit Perfil page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Perfil');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', perfilPageUrlPattern);
      });

      it('last delete button click should delete instance of Perfil', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('perfil').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', perfilPageUrlPattern);

        perfil = undefined;
      });
    });
  });

  describe('new Perfil page', () => {
    beforeEach(() => {
      cy.visit(`${perfilPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Perfil');
    });

    it('should create an instance of Perfil', () => {
      cy.get(`[data-cy="cantAlbumes"]`).type('27018').should('have.value', '27018');

      cy.get(`[data-cy="cantSeguidores"]`).type('28052').should('have.value', '28052');

      cy.get(`[data-cy="cantSeguidos"]`).type('46490').should('have.value', '46490');

      cy.get(`[data-cy="descripcion"]`).type('Account Algodón').should('have.value', 'Account Algodón');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        perfil = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', perfilPageUrlPattern);
    });
  });
});
