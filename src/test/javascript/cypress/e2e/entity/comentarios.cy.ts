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

describe('Comentarios e2e test', () => {
  const comentariosPageUrl = '/comentarios';
  const comentariosPageUrlPattern = new RegExp('/comentarios(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const comentariosSample = {};

  let comentarios;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/comentarios+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/comentarios').as('postEntityRequest');
    cy.intercept('DELETE', '/api/comentarios/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (comentarios) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/comentarios/${comentarios.id}`,
      }).then(() => {
        comentarios = undefined;
      });
    }
  });

  it('Comentarios menu should load Comentarios page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('comentarios');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Comentarios').should('exist');
    cy.url().should('match', comentariosPageUrlPattern);
  });

  describe('Comentarios page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(comentariosPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Comentarios page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/comentarios/new$'));
        cy.getEntityCreateUpdateHeading('Comentarios');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comentariosPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/comentarios',
          body: comentariosSample,
        }).then(({ body }) => {
          comentarios = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/comentarios+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [comentarios],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(comentariosPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Comentarios page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('comentarios');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comentariosPageUrlPattern);
      });

      it('edit button click should load edit Comentarios page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Comentarios');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comentariosPageUrlPattern);
      });

      it('edit button click should load edit Comentarios page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Comentarios');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comentariosPageUrlPattern);
      });

      it('last delete button click should delete instance of Comentarios', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('comentarios').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comentariosPageUrlPattern);

        comentarios = undefined;
      });
    });
  });

  describe('new Comentarios page', () => {
    beforeEach(() => {
      cy.visit(`${comentariosPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Comentarios');
    });

    it('should create an instance of Comentarios', () => {
      cy.get(`[data-cy="descripcion"]`).type('synergistic generating microchip').should('have.value', 'synergistic generating microchip');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        comentarios = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', comentariosPageUrlPattern);
    });
  });
});
