const expect = require('chai').expect;
const sinon = require('sinon');

const Service = require('../models/service');
const ServiceController = require('../controllers/service');

describe('Test One', function() {
    it('Throw an expection', function() {

        fakeRes = {
            statusCode: undefined,
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(data) {
              return data;
            },
          }

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

        ServiceController.registerService(req, fakeRes, () => {})
            .then(result => {
                console.log(result)
            });
    })
});