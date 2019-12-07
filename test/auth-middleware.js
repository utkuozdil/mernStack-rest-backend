const expect = require("chai").expect;
const jsonwebtoken = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/auth");

describe("auth middleware", () => {
  it("throws error if no auth header", () => {
    const request = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, request, {}, () => {})).to.throw(
      "not authenticated"
    );
  });

  it("throws error if auth header is only one string", () => {
    const request = {
      get: function(headerName) {
        return "test";
      }
    };
    expect(authMiddleware.bind(this, request, {}, () => {})).to.throw();
  });

  it("throws error if token cannot be verified", () => {
    const request = {
      get: function(headerName) {
        return "Bearer xyz";
      }
    };
    expect(authMiddleware.bind(this, request, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", () => {
    const request = {
      get: function(headerName) {
        return "Bearer xyz";
      }
    };

    sinon.stub(jsonwebtoken, "verify");
    jsonwebtoken.verify.returns({ userId: "abc" });

    authMiddleware(request, {}, () => {});
    expect(request).to.have.property("userId");
    expect(request).to.have.property("userId", "abc");
    expect(jsonwebtoken.verify.called).to.be.true;
    jsonwebtoken.verify.restore();
  });
});
