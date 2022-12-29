const { DESCRIBE } = require('sequelize/types/query-types');
const { validateName, validateEmail, validatePassword } = require('../util/validator');

var { expect } = require('chai');

describe("Testing validator", function () {
    it("Should return true for a valid name", function () {
        expect(validateName("Nurudeen")).to.equal(true)
    })
    it("Should return true for a valid name", function () {
        expect(validateName("Nurudeen01")).to.equal(false)
    })
})