import * as assert from "assert"
import { describe, after, afterEach, before, beforeEach, it } from "mocha"
import { SinonSpy, spy } from "sinon"

import { HTTPServer } from "../../src/core/HTTPServer"
import { HTTPController } from "../../src/core/HTTPController"
import axios from "axios"

describe("HTTPServer", () => {

    describe("constructor", () => {

        it("should save the port provided", () => {

            // Create a test server on port 1337
            let test_server = new HTTPServer(1337)

            // Verify that the server is set to use 1337 as a port
            assert.equal(test_server.getPort(), 1337, "Port number was not stored correctly.")

        })

        it("should initialize an Express Application", () => {

            // Create a test server
            let test_server = new HTTPServer(1337)

            // Check by duck typing that the Application appears to be an Express server
            assert.equal(typeof test_server.getApplication().use, "function", "The Express Application did not have a use function.")
            assert.equal(typeof test_server.getApplication().route, "function", "The Express Application did not have a route function.")
            assert.equal(typeof test_server.getApplication().listen, "function", "The Express Application did not have a listen function.")
            
        })

    })

    describe("enableHelmetProtections", () => {

        it("should mount the Helmet middleware onto the Express middleware stack", () => {

            // Create a test server
            let test_server = new HTTPServer(1337)

            // This test depends on the creation of the Express router as proof of addition. 
            // As such it is necessary to verify that the router is null at the time of creation.
            assert.equal(test_server.getApplication()._router, undefined, "The Application had a router defined - so this test case is now invalid")

            // Enable the helmet protections
            test_server.enableHelmetProtections()

            // Check that the router now exists
            assert.notEqual(test_server.getApplication()._router, undefined, "The Application did not have a router defined - meaning the middleware was not mounted.")

        })

    })

    describe("Active Server Functions", () => {

        // Define a variable to hold the description scope test object 
        let test_server: HTTPServer;

        beforeEach(() => {
            
            // Create a new server and assign it to the scoped test object
            test_server = new HTTPServer(0)

            // Start the test server on port 1337
            test_server.start()

        })

        afterEach(() => {

            // Cleanup the test server after each use
            test_server.stop()

        })

        describe("start", () => {

            it("should start a webserver on the given port", () => {

                // Retrieve the port the server was started on
                let port: number = test_server["underlying_server"].address().port

                // Attempt to make a HTTP request to the server to ensure that it is running correctly
                return axios.get(`http://localhost:${port}/test`)
                    .catch((error) => {

                        // Check that the result was a 404 error for the requested resource
                        assert.equal(error.message, "Request failed with status code 404")
                        
                    })

            })
            
        })

        describe("stop", () => {

            it("should stop a webserver when requested", () => {

                // Save the port so that when the server shuts down we still have a record
                let port: number = test_server.getActivePort()

                // Attempt to make a request to the server to ensure it is running when the test starts - copied from the above start test
                return axios.get(`http://localhost:${port}/test`)
                    .catch((error) => {

                        // Check that the result was a 404 error for the requested resource
                        assert.equal(error.message, "Request failed with status code 404")

                        // Now kill the server so that we can observe the endpoint is no longer available
                        test_server.stop()

                        // Send another identical HTTPRequest to the server
                        return axios.get(`http://localhost:${port}/test`)

                    })
                    .then(() => {

                        // If this request suceeded then we have already failed.
                        assert(false, "The endpoint was still available to the HTTPRequest")

                    })
                    .catch((error) => {
                        
                        // Check that the failure was the type we were expecting
                        assert.equal(error.message, `connect ECONNREFUSED 127.0.0.1:${port}`)

                    })

            })

        })

        describe("isStarted", () => {

            it("should return true when the server is running", () => {

                assert.equal(test_server.isStarted(), true, "The server is running but the isStarted flag is false");

            })

            it("should return false when the server is stopped", () => {

                // Ensure that the server is stopped before testing
                test_server.stop()

                assert.equal(test_server.isStarted(), false, "The server is stopped but the isStarted flag is true")

            })

        })

        describe("getActivePort", () => {

            let test_server

            beforeEach(() => {
                
                test_server = new HTTPServer(0)

                test_server.start()

            })

            afterEach(() => {

                // Ensure that the server is cleaned up
                test_server.stop()

            })

            it("should return null when no server is active", () => {

                // Stop the webserver
                test_server.stop()

                // Check that the result is null
                assert.equal(test_server.getActivePort(), null)

            })

            it("should return a number when the server is active", () => {

                // Assert that the value is not null
                assert.notEqual(test_server.getActivePort(), null)
                assert.equal(typeof test_server.getActivePort(), "number")

            })

        })

        describe("mount", () => {

            class test_controller extends HTTPController {

                get(req, res) {

                    res.json({
                        test: "Work"
                    })

                }

            } 

            beforeEach(() => {

                // Stop the server
                test_server.stop()

                // Mount the controller
                test_server.mount("/test", test_controller)

                // Start the webserver
                test_server.start()

            })

            it("should instantiate and mount a Controller of the type provided", () => {

                // Get the port to make the request to
                let port: number = test_server.getActivePort()

                // Attempt to request the mounted controller
                return axios.get(`http://localhost:${port}/test`)
					.then((response) => {

						// Check that the body is correct
						assert.deepEqual(response.data, {test: "Work"})

					})

            })

        })

    })

})