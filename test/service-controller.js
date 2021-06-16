const expect = require('chai').expect;
const sinon = require('sinon');

const Service = require('../models/service');
const ServiceController = require('../controllers/service');

const res = {
  statusCode: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    return data;
  },
}

describe('Test One', function() {
    it('Save function throws an expection', function(done) {
          const service = {
            offeredServices: 'Cocinero',
            rate: 15,
            references: 'Arteco', 
            description: 'Lorenipsum..',
            userId: 'owiru232jrbnuib34'
        }

        sinon.stub(Service.prototype, 'save');
        Service.prototype.save.returns(new Promise(reject => reject(new Error())));

        const req = {
            body: service
        };

        ServiceController.registerService(req, res, () => {})
            .then(() => {
                expect(ServiceController.registerService).to.throw();
                expect(res.statusCode).to.equal(500);
                done();
            });
        Service.prototype.save.restore();
    })
});

describe('Test Two', function() {
  it('Save function return an empty object', function(done) {
        const service = {
          offeredServices: 'Cocinero',
          rate: 15,
          references: 'Arteco', 
          description: 'Lorenipsum..',
          userId: 'owiru232jrbnuib34'
      }

      sinon.stub(Service.prototype, 'save');
      Service.prototype.save.returns(new Promise(resolve => resolve({})));

      const req = {
          body: service
      };

      ServiceController.registerService(req, res, () => {})
          .then(() => {
              expect(ServiceController.registerService).to.throw();
              expect(res.statusCode).to.equal(500);
              done();
          });
      Service.prototype.save.restore();
  })
});

describe('Test Three', function() {
  it('Save function return a correct created user', function(done) {
        const service = {
          offeredServices: 'Cocinero',
          rate: 15,
          references: 'Arteco', 
          description: 'Lorenipsum..',
          userId: 'owiru232jrbnuib34'
      }

      sinon.stub(Service.prototype, 'save');
      Service.prototype.save.returns(new Promise(resolve => resolve(service)));

      const req = {
          body: service
      };

      ServiceController.registerService(req, res, () => {})
          .then(result => {
              expect(result.service).to.equal(req.body);
              expect(res.statusCode).to.equal(201);
              done();
          });
      Service.prototype.save.restore();
  })
});

describe('Test Four', function() {
  it('Edit service', function(done) {
      
    const service = {
      offeredServices: 'Pinche',
      rate: 15,
      references: 'Arteco', 
      description: 'Lorenipsum..',
      userId: 'owiru232jrbnuib34'
  }
    
    const updatedService = {
          offeredServices: 'Cocinero',
          rate: 15,
          references: 'Arteco', 
          description: 'Lorenipsum..',
          userId: 'owiru232jrbnuib34'
      }

      sinon.stub(Service, 'findById');
      sinon.stub(Service.prototype, 'save');

      Service.findById.returns(new Promise(resolve => resolve(service)));
      Service.prototype.save.returns(new Promise(resolve => resolve(updatedService)));

      const req = {
          body: service
      };

      ServiceController.editService(req, res, () => {})
          .then(result => {
              expect(req.body).to.equal(service);
              expect(result.service).to.equal(updatedService);
              expect(res.statusCode).to.equal(201);
          });
          Service.prototype.save.restore();
          Service.findById.restore();
          done(); 
  })
});

describe('Test Five', function() {
  it('Delete Service correctly', function(done) {
      const service = {
          offeredServices: 'Cocinero',
          rate: 15,
          references: 'Arteco', 
          description: 'Lorenipsum..',
          userId: 'owiru232jrbnuib34'
      }

      const req = {
        body: service
      };

      sinon.stub(Service, 'deleteOne');
      Service.deleteOne.returns(new Promise(resolve => resolve(service)));

      ServiceController.deleteService(req, res, () => {})
          .then(result => {
              expect(result.service).to.equal({});
              expect(res.statusCode).to.equal(200);
          });
          done();
          Service.deleteOne.restore();
  })
});

describe('Test Six', function() {
  it('Delete Service correctly', function(done) {
      const service = {
          offeredServices: 'Cocinero',
          rate: 15,
          references: 'Arteco', 
          description: 'Lorenipsum..',
          userId: 'owiru232jrbnuib34'
      }

      const req = {
        body: service
      };

      sinon.stub(Service, 'deleteOne');
      Service.deleteOne.returns(new Promise(resolve => resolve(service)));

      ServiceController.deleteService(req, res, () => {})
          .then(result => {
              expect(result).to.equal({});
              expect(res.statusCode).to.equal(200);
              
          });
      done();
      Service.deleteOne.restore();
  })
});

describe('Test seven', function() {
  it('deleteOne returns a reject error', function(done) {
      const service = {
          offeredServices: 'Cocinero',
          rate: 15,
          references: 'Arteco', 
          description: 'Lorenipsum..',
          userId: 'owiru232jrbnuib34'
      }

      const req = {
        body: service
      };

      sinon.stub(Service, 'deleteOne');
      Service.deleteOne.returns(new Promise(reject => reject(new Error())));

      ServiceController.deleteService(req, res, () => {})
          .then(result => {
              expect(result).to.equal({});
              expect(res.statusCode).to.equal(500);
              
          });
      done();
      Service.deleteOne.restore();
  })
});

