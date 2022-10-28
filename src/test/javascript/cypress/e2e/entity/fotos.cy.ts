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

describe('Fotos e2e test', () => {
  const fotosPageUrl = '/fotos';
  const fotosPageUrlPattern = new RegExp('/fotos(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const fotosSample = {};

  let fotos;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/fotos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/fotos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/fotos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (fotos) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/fotos/${fotos.id}`,
      }).then(() => {
        fotos = undefined;
      });
    }
  });

  it('Fotos menu should load Fotos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('fotos');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Fotos').should('exist');
    cy.url().should('match', fotosPageUrlPattern);
  });

  describe('Fotos page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(fotosPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Fotos page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/fotos/new$'));
        cy.getEntityCreateUpdateHeading('Fotos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', fotosPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/fotos',
          body: fotosSample,
        }).then(({ body }) => {
          fotos = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/fotos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [fotos],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(fotosPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Fotos page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('fotos');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', fotosPageUrlPattern);
      });

      it('edit button click should load edit Fotos page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Fotos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', fotosPageUrlPattern);
      });

      it('edit button click should load edit Fotos page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Fotos');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', fotosPageUrlPattern);
      });

      it('last delete button click should delete instance of Fotos', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('fotos').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', fotosPageUrlPattern);

        fotos = undefined;
      });
    });
  });

  describe('new Fotos page', () => {
    beforeEach(() => {
      cy.visit(`${fotosPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Fotos');
    });

    it('should create an instance of Fotos', () => {
      cy.get(`[data-cy="descripcion"]`).type('parse hack').should('have.value', 'parse hack');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        fotos = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', fotosPageUrlPattern);
    });
  });
});
