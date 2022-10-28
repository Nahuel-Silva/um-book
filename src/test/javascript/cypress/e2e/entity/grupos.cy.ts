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

describe('Grupos e2e test', () => {
  const gruposPageUrl = '/grupos';
  const gruposPageUrlPattern = new RegExp('/grupos(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const gruposSample = {};

  let grupos;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/grupos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/grupos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/grupos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (grupos) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/grupos/${grupos.id}`,
      }).then(() => {
        grupos = undefined;
      });
    }
  });

  it('Grupos menu should load Grupos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('grupos');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Grupos').should('exist');
    cy.url().should('match', gruposPageUrlPattern);
  });

  describe('Grupos page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(gruposPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Grupos page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/grupos/new$'));
        cy.getEntityCreateUpdateHeading('Grupos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', gruposPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/grupos',
          body: gruposSample,
        }).then(({ body }) => {
          grupos = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/grupos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [grupos],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(gruposPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Grupos page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('grupos');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', gruposPageUrlPattern);
      });

      it('edit button click should load edit Grupos page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Grupos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', gruposPageUrlPattern);
      });

      it('edit button click should load edit Grupos page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Grupos');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', gruposPageUrlPattern);
      });

      it('last delete button click should delete instance of Grupos', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('grupos').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', gruposPageUrlPattern);

        grupos = undefined;
      });
    });
  });

  describe('new Grupos page', () => {
    beforeEach(() => {
      cy.visit(`${gruposPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Grupos');
    });

    it('should create an instance of Grupos', () => {
      cy.get(`[data-cy="nombre"]`).type('indexing sistema').should('have.value', 'indexing sistema');

      cy.get(`[data-cy="cantPersonas"]`).type('Coordinador Facilitador').should('have.value', 'Coordinador Facilitador');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        grupos = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', gruposPageUrlPattern);
    });
  });
});
