import * as assert from "assert"
import { describe, after, afterEach, before, beforeEach, it } from "mocha"
import { SinonSpy, spy } from "sinon"

import { HTTPAccessLog } from "../../src/core/HTTPAccessLog"
import { HTTPServer } from "../../src/core/HTTPServer"
import { Logger } from "../../src/core/Logger"
import * as mockdate from "mockdate"
import axios from "axios"

describe("HTTPAccessLog", () => {

    describe("constructor", () => {

        it("should store the destination logger provided", () => {

            // Create a test logger as a placeholder
            let test_logger = new Logger(false, false)

            // Create a new AccessLog with the placeholder logger
            let test_access_log = new HTTPAccessLog(test_logger)

            // Verify that the provided logger was stored correctly
            // Request the destination log forcefully to avoid TypeScript compiler
            assert.equal(test_access_log["destination_log"], test_logger, "The logger was not correctly stored.")  

        })

    })

    describe("logRequest", () => {

        let test_server: HTTPServer,
            test_logger: Logger

        // Create a test Express application to mount the middleware to
        beforeEach(() => {

            // Stub out Date to a constant
            mockdate.set("1/1/2000")

            // Create a new test server
            test_server = new HTTPServer(0)

            // Create a test Logger to output the AccessLog to
            test_logger = new Logger(false, false)

            // Stub out the winston_connection log method with a fake to test the log mechanism
            test_logger.winston_connection.log = spy()

            // Create a test AccessLog
            let test_log = new HTTPAccessLog(test_logger)

            // Mount the test_log onto the test_server
            test_server.getApplication().use(test_log.middleware())

            // Start the test server
            test_server.start()

        })

        afterEach(() => {

            // Close down the test_server
            test_server.stop()

        })

        it("should format the information in req and res correctly", () => {

            return axios.get(`http://localhost:${test_server.getActivePort()}/test`)
                    .catch(() => { // Needs to catch because endpoint doesn't exist and therefore will 404

                        // Retrieve the call value from the spy
                        let test_spy = test_logger.winston_connection.log as SinonSpy

                        // Check that the method was called
                        assert(test_spy.called, "The log method was not called")

                        // Verify that the method was called with the correct signature - Use String comparison because Ohh Javascript
                        assert.equal(
                            test_spy.args[0].toString(), 
                            [ "info", "::ffff:127.0.0.1 [01/01/2000:00:00:00 +0000] \'GET /test http\' 404 0"],
                            "The Log response was not correctly formatted given the provided information.")

                    }) 

        })

    })

})