const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const UserController = require('../controllers/user');

const bcrypt = require('bcrypt');

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

describe('Test Eight', function() {
    it('Register user correctly', function(done) {
        
        const userToSave = {
            fullName: "Sebas Adrover",
            username: "sadrover",
            email: "peyse@gmail.com",
            phoneNumber: "8976755674", 
            password: "hola"
        }

        sinon.stub(User, 'findOne');
        User.findOne.returns(new Promise(resolve => resolve({})));

        sinon.stub(bcrypt, 'hash');
        bcrypt.hash.returns(new Promise(resolve => resolve("hashPassword")));

        sinon.stub(User.prototype, 'save');
        User.prototype.save.returns(new Promise(resolve => resolve(userToSave)))

        const req = {
            body: userToSave
        };

        UserController.registerUser(req, res, () => {})
            .then(result => {
                expect(result.user).to.equal(userToSave);
                expect(res.statusCode).to.equal(201);
            });
        User.findOne.restore();
        bcrypt.hash.restore();
        User.prototype.save.restore();
        done();
    })
});

describe('Test Nine', function() {
    it('The username field already exist', function(done) {
        
        const userToSave = {
            fullName: "Sebas Adrover",
            username: "sadrover",
            email: "peyse@gmail.com",
            phoneNumber: "8976755674", 
            password: "hola"
        }

        const existUser = {
            fullName: "Sebas Adrover",
            username: "sadrover",
            email: "miquel@gmail.com",
            phoneNumber: "876654098", 
            password: "hola"
        }

        sinon.stub(User, 'findOne');
        User.findOne.returns(new Promise(resolve => resolve(existUser)));

        const req = {
            body: userToSave
        };

        UserController.registerUser(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(500);
            });
        User.findOne.restore();
        done();
    })
});

describe('Test Ten', function() {
    it('Login user correctly', function(done) {
        
        const userToLogin = {
            username: "sadrover",
            password: "hola"
        }

        sinon.stub(User, 'findOne');
        User.findOne.returns(new Promise(resolve => resolve(userToLogin)));

        sinon.stub(bcrypt, 'compare');
        bcrypt.compare.returns(new Promise(resolve => resolve("hola")));

        const req = {
            body: userToLogin
        };

        UserController.loginUser(req, res, () => {})
            .then(result => {
                expect(result.user).to.equal(userToLogin);
                expect(res.statusCode).to.equal(200);
            });
        User.findOne.restore();
        bcrypt.compare.restore();
        done();
    })
});

describe('Test Eleven', function() {
    it('The user does not exists', function(done) {
        
        const userToLogin = {
            username: "sadrover",
            password: "hola"
        }

        sinon.stub(User, 'findOne');
        User.findOne.returns(new Promise(resolve => resolve({})));

        sinon.stub(bcrypt, 'compare');
        bcrypt.compare.returns(new Promise(resolve => resolve("hola")));

        const req = {
            body: userToLogin
        };

        UserController.loginUser(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(500);
            });
        User.findOne.restore();
        bcrypt.compare.restore();
        done();
    })
});

describe('Test Twelve', function() {
    it('The passwords do not match', function(done) {
        
        const userToLogin = {
            username: "sadrover",
            password: "hola"
        }

        sinon.stub(User, 'findOne');
        User.findOne.returns(new Promise(resolve => resolve({})));

        sinon.stub(bcrypt, 'compare');
        bcrypt.compare.returns(new Promise(resolve => resolve("aloh")));

        const req = {
            body: userToLogin
        };

        UserController.loginUser(req, res, () => {})
            .then(() => {
                expect(res.statusCode).to.equal(500);
            });
        User.findOne.restore();
        bcrypt.compare.restore();
        done();
    })
});