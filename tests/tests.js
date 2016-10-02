mocha.setup("bdd");

import {jqueryRequester} from "jquery-requester";
import {requester} from "requester";

const expect = chai.expect;

describe("Tests", function () {
    let user = {
        username: "someUserName",
        favourites: []
    };

    describe("Sample test", function () {
        it("Test that should pass", function () {
            let obj = {};
            expect(obj).to.equal(obj);
        });
    });

    describe("Requester tests", function () {
        const CURRENT_USER_ID = "current-user-id";
        const AUTH_TOKEN = "auth-token";
        const CURRENT_USER_NAME = "username";

        describe("Register user tests", function () {
            let username = "someUserName";
            let password = "somePassword";
            let sampleUser = {
                username,
                password,
                favourites: []
            };

            beforeEach(function () {
                sinon.stub(jqueryRequester, "post")
                    .returns(new Promise((resolve, reject) => {
                        resolve(user);
                    }));
            });

            afterEach(function () {
                jqueryRequester.post.restore();
            });

            it("Register user should call post method exactly once", function (done) {
                requester.registerUser(username, password)
                    .then(() => {
                        expect(jqueryRequester.post.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Register user should return user with correct username", function (done) {
                requester.registerUser(username, password)
                    .then((user) => {
                        expect(user.username).to.equal(username);
                    })
                    .then(done, done);
            });

            it("Register user should return user with correct favourites", function (done) {
                requester.registerUser(username, password)
                    .then((user) => {
                        expect(user.favourites).to.eql([]);
                    })
                    .then(done, done);
            });

            it("Register user should call post with correct url", function (done) {
                requester.registerUser(username, password)
                    .then(() => {
                        let expected = "https://baas.kinvey.com/user/kid_rJWkfzw6";
                        let actual = jqueryRequester.post.firstCall.args[0];
                        expect(actual).to.equal(expected);
                    })
                    .then(done, done);
            });

            it("Register user should call post with correct data", function (done) {
                requester.registerUser(username, password)
                    .then(() => {
                        let actual = jqueryRequester.post.firstCall.args[2];
                        expect(actual).to.eql(sampleUser);
                    })
                    .then(done, done);
            });
        });

        describe("Login user tests", function () {
            let _id = "someId";
            let username = "someUsername";
            let password = "somePassword";
            let _kmd = {};
            _kmd.authtoken = "authToken";
            let resultUser = {
                _id,
                username,
                _kmd
            };

            beforeEach(function () {
                sinon.stub(jqueryRequester, "post")
                    .returns(new Promise((resolve, reject) => {
                        resolve(resultUser);
                    }));
            });

            afterEach(function () {
                jqueryRequester.post.restore();
                localStorage.removeItem(CURRENT_USER_NAME);
                localStorage.removeItem(AUTH_TOKEN);
                localStorage.removeItem(CURRENT_USER_ID);
            });

            it("Login user should call post method exactly once", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        expect(jqueryRequester.post.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Login user should set username in local storage", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        expect(localStorage.getItem(CURRENT_USER_NAME)).to.equal(username);
                    })
                    .then(done, done);
            });

            it("Login user should set authtoken in local storage", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        expect(localStorage.getItem(AUTH_TOKEN)).to.equal(_kmd.authtoken);
                    })
                    .then(done, done);
            });

            it("Login user should set id in local storage", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        expect(localStorage.getItem(CURRENT_USER_ID)).to.equal(_id);
                    })
                    .then(done, done);
            });

            it("Login user should call post with correct url", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        let expected = "https://baas.kinvey.com/user/kid_rJWkfzw6/login";
                        let actual = jqueryRequester.post.firstCall.args[0];
                        expect(actual).to.equal(expected);
                    })
                    .then(done, done);
            });

            it("Login user should call post with correct data", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        let actual = jqueryRequester.post.firstCall.args[2];
                        expect(actual).to.eql({ username, password });
                    })
                    .then(done, done);
            });
        });

        describe("Logout user tests", function () {
            let _id = "someId";
            let username = "someUsername";
            let password = "somePassword";
            let loginUrl = "https://baas.kinvey.com/user/kid_rJWkfzw6/login";
            let logoutUrl = "https://baas.kinvey.com/user/kid_rJWkfzw6/_logout";
            let _kmd = {};
            _kmd.authtoken = "authToken";
            let resultUser = {
                _id,
                username,
                _kmd
            };

            beforeEach(function () {
                sinon.stub(jqueryRequester, "post", function (url, headers, data) {
                    return new Promise((resolve, reject) => {
                        if (url === loginUrl) {
                            resolve(resultUser);
                            return;
                        }
                        if (url === logoutUrl) {
                            resolve();
                        }
                    });
                });
            });

            afterEach(function () {
                jqueryRequester.post.restore();
                localStorage.removeItem(CURRENT_USER_NAME);
                localStorage.removeItem(AUTH_TOKEN);
                localStorage.removeItem(CURRENT_USER_ID);
            });

            it("Logout user should call post method exactly once", function (done) {
                requester.logoutUser()
                    .then(() => {
                        expect(jqueryRequester.post.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Logout user should call post with correct url", function (done) {
                requester.logoutUser()
                    .then(() => {
                        let actual = jqueryRequester.post.firstCall.args[0];
                        expect(actual).to.equal(logoutUrl);
                    })
                    .then(done, done);
            });

            it("Logout user should remove username in local storage", function (done) {
                requester.loginUser()
                    .then(() => {
                        return requester.logoutUser();
                    })
                    .then(() => {
                        expect(localStorage.getItem(CURRENT_USER_NAME)).to.equal(null);
                    })
                    .then(done, done);
            });

            it("Logout user should remove authtoken in local storage", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        return requester.logoutUser();
                    })
                    .then(() => {
                        expect(localStorage.getItem(AUTH_TOKEN)).to.equal(null);
                    })
                    .then(done, done);
            });

            it("Logout user should remove id in local storage", function (done) {
                requester.loginUser(username, password)
                    .then(() => {
                        return requester.logoutUser();
                    })
                    .then(() => {
                        expect(localStorage.getItem(CURRENT_USER_ID)).to.equal(null);
                    })
                    .then(done, done);
            });
        });

        describe("IsLoggedIn tests", function () {
            afterEach(function () {
                localStorage.removeItem(CURRENT_USER_NAME);
            });
            it("IsLoggedIn should return currect username, when user is logged in", function (done) {
                let expectedUsername = "some-username";
                localStorage.setItem(CURRENT_USER_NAME, expectedUsername);
                requester.isLoggedIn()
                    .then((username) => {
                        expect(username).to.equal(expectedUsername);
                    })
                    .then(done, done);
            });

            it("IsLoggedIn to call reject, when user is not logged in", function (done) {
                requester.isLoggedIn()
                    .then(() => {
                        throw new Error("Promise should reject.");
                    })
                    .catch(() => {
                        done();
                    });

            });
        });

        describe("Get user info tests", function () {
            let id = "someId";
            let expectedUrl = `https://baas.kinvey.com/user/kid_rJWkfzw6/${id}`;
            let username = "someUsername";
            let favourites = ["1", "2", "3"];
            let resultUser = { username, favourites };

            beforeEach(function () {
                localStorage.setItem(CURRENT_USER_ID, id);
                sinon.stub(jqueryRequester, "get")
                    .returns(new Promise((resolve, reject) => {
                        resolve(resultUser);
                    }));
            });

            afterEach(function () {
                localStorage.removeItem(CURRENT_USER_ID);
                jqueryRequester.get.restore();
            });

            it("Get user info user should call get method exactly once", function (done) {
                requester.getUserInfo()
                    .then(() => {
                        expect(jqueryRequester.get.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Get user info should call get with correct url", function (done) {
                requester.getUserInfo()
                    .then(() => {
                        let actual = jqueryRequester.get.firstCall.args[0];
                        expect(actual).to.equal(expectedUrl);
                    })
                    .then(done, done);
            });

            it("Get user info should return correct result", function (done) {
                requester.getUserInfo()
                    .then((user) => {
                        expect(user.username).to.equal(username);
                        expect(user.favourites).to.equal(favourites);
                    })
                    .then(done, done);
            });

        });

        describe("Add restaurant to favourites tests", function () {
            let userId = "userId";
            let expectedUrl = `https://baas.kinvey.com/user/kid_rJWkfzw6/${userId}`;
            let username = "someUsername";
            let favourites = ["1", "2", "3"];
            let resultUser = { username, favourites };

            beforeEach(function () {
                localStorage.setItem(CURRENT_USER_ID, userId);
                sinon.stub(jqueryRequester, "get")
                    .returns(new Promise((resolve, reject) => {
                        resolve(resultUser);
                    }));

                sinon.stub(jqueryRequester, "put");

            });

            afterEach(function () {
                resultUser.favourites = ["1", "2", "3"];
                localStorage.removeItem(CURRENT_USER_ID);
                jqueryRequester.get.restore();
                jqueryRequester.put.restore();
            });

            it("Add restaurant to favourites should call put method exactly once", function (done) {
                let id = "someId";
                requester.addRestaurantToFavourites(id)
                    .then(() => {
                        expect(jqueryRequester.put.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Add restaurant to favourites should call put method with correct url", function (done) {
                let id = "someId";
                requester.addRestaurantToFavourites(id)
                    .then(() => {
                        let actual = jqueryRequester.put.firstCall.args[0];
                        expect(actual).to.equal(expectedUrl);
                    })
                    .then(done, done);
            });

            it("Add restaurant to favourites should call put method with correct data", function (done) {
                let id = "someId";
                requester.addRestaurantToFavourites(id)
                    .then(() => {
                        let expected = ["1", "2", "3", "someId"];
                        let actual = jqueryRequester.put.firstCall.args[2].favourites;
                        expect(actual).to.eql(expected);
                    })
                    .then(done, done);
            });

            it("Add restaurant to favourites should throw when place is already in favourites", function (done) {
                let id = "3";
                requester.addRestaurantToFavourites(id)
                    .catch((e) => {
                        expect(e.message).to.equal("The place is already added to favourites.");
                    })
                    .then(done, done);
            });
        });

        describe("Get all restaurants tests", function () {
            let expectedUrl = "https://baas.kinvey.com/appdata/kid_rJWkfzw6/restaurants";
            let restaurant1 = {
                id: 1,
                name: "restaurant"
            };
            let restaurant2 = {
                id: 2,
                name: "café"
            };
            let restaurants = [restaurant1, restaurant2];

            beforeEach(function () {
                sinon.stub(jqueryRequester, "get")
                    .returns(new Promise((resolve, reject) => {
                        resolve(restaurants);
                    }));
            });

            afterEach(function () {
                jqueryRequester.get.restore();
            });

            it("Get all restaurants should call get method exactly once", function (done) {
                requester.getAllRestaurants()
                    .then(() => {
                        expect(jqueryRequester.get.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Get all restaurants should call get method with correct url", function (done) {
                requester.getAllRestaurants()
                    .then(() => {
                        let actual = jqueryRequester.get.firstCall.args[0];
                        expect(actual).to.equal(expectedUrl);
                    })
                    .then(done, done);
            });

            it("Get all restaurants should return correct data", function (done) {
                requester.getAllRestaurants()
                    .then((data) => {
                        expect(data[0]).to.eql(restaurant1);
                        expect(data[1]).to.eql(restaurant2);
                    })
                    .then(done, done);
            });
        });

        describe("Get restaurant by id tests", function () {
            let id = "someId";
            let expectedUrl = `https://baas.kinvey.com/appdata/kid_rJWkfzw6/restaurants/${id}`;
            let restaurant = {
                id: "someId",
                name: "restaurant"
            };

            beforeEach(function () {
                sinon.stub(jqueryRequester, "get")
                    .returns(new Promise((resolve, reject) => {
                        resolve(restaurant);
                    }));
            });

            afterEach(function () {
                jqueryRequester.get.restore();
            });

            it("Get restaurant by id should call get method exactly once", function (done) {
                requester.getRestaurantById(id)
                    .then(() => {
                        expect(jqueryRequester.get.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Get restaurant by id should call get method with correct url", function (done) {
                requester.getRestaurantById(id)
                    .then(() => {
                        let actual = jqueryRequester.get.firstCall.args[0];
                        expect(actual).to.equal(expectedUrl);
                    })
                    .then(done, done);
            });

            it("Get restaurant by id should return correct data", function (done) {
                requester.getRestaurantById(id)
                    .then((result) => {
                        expect(result).to.eql(restaurant);
                    })
                    .then(done, done);
            });
        });

        describe("Add comment to restaurants tests", function () {
            let id = "someId";
            let content = "someContent";
            let expectedUrl = `https://baas.kinvey.com/appdata/kid_rJWkfzw6/restaurants/${id}`;
            let restaurant = {
                id: "someId",
                name: "restaurant",
                comments: []
            };
            let date = new Date();
            let dateAsString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
            let username = "someUsername";

            beforeEach(function () {
                localStorage.setItem(CURRENT_USER_NAME, username);
                sinon.stub(jqueryRequester, "get")
                    .returns(new Promise((resolve, reject) => {
                        resolve(restaurant);
                    }));

                sinon.stub(jqueryRequester, "put");
            });

            afterEach(function () {
                restaurant.comments = [];
                localStorage.removeItem(CURRENT_USER_NAME);
                jqueryRequester.get.restore();
                jqueryRequester.put.restore();
            });

            it("Add comment to restaurant should call put method exactly once", function (done) {
                requester.addCommentToRestaurant(id,content)
                    .then(() => {
                        expect(jqueryRequester.put.calledOnce).to.be.true;
                    })
                    .then(done, done);
            });

            it("Add comment to restaurant should call put method with correct url", function (done) {
                requester.addCommentToRestaurant(id,content)
                    .then(() => {
                        let actual = jqueryRequester.put.firstCall.args[0];
                        expect(actual).to.equal(expectedUrl);
                    })
                    .then(done, done);
            });

            it("Add comment to restaurant should call put method with correct previous data", function (done) {
                requester.addCommentToRestaurant(id,content)
                    .then(() => {
                        let actual = jqueryRequester.put.firstCall.args[2];
                        expect(actual.id).to.equal(id);
                        expect(actual.name).to.equal("restaurant");
                    })
                    .then(done, done);
            });

            it("Add comment to restaurant should call put method with correct new data", function (done) {
                requester.addCommentToRestaurant(id,content)
                    .then(() => {
                        let actualComment = jqueryRequester.put.firstCall.args[2].comments.pop();
                        expect(actualComment.content).to.equal(content);
                        expect(actualComment.username).to.equal(username);
                        expect(actualComment.date).to.equal(dateAsString);
                    })
                    .then(done, done);
            });
 
        });
    });
});

mocha.run();
