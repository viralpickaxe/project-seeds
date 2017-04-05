import * as assert from "assert"
import { describe, after, afterEach, before, beforeEach, it } from "mocha"
import { SinonSpy, spy } from "sinon"

import { Logger } from "../../src/core/Logger"
import axios from "axios"
import * as Winston from "winston"

describe("Logger", () => {

    describe("constructor", () => {

        it("should not intstantiate any Log transports if neither flag is enabled", () => {

            // Create a test logger with no transports flagged
            let test_logger = new Logger(false, false)

            // Verify that the transports object is empty ( string conversion check ) 
            assert.equal(test_logger.winston_connection.transports.toString(), {})

        })

        it("should correctly setup a console log output when the enable_console flag is high", () => {

            // Create a new Logger with console enabled but Papertrail disabled.
            let test_logger = new Logger(true, false)

            // Lookup the enabled winston transports
            let transports = test_logger.winston_connection.transports

            // Check for the existence of a transport named console
            assert(transports["console"], "The console transport was not mounted")

        })

    })

    describe("log", () => {

        let test_logger: Logger

        beforeEach(() => {

            // Create a new Logger to test with
            test_logger = new Logger(false, false)

            // Stub out the winston_connection log method with a fake to test the log mechanism
            test_logger.winston_connection.log = spy()

        })

        it("should log the message provided correctly at the provided level", () => {

            // Log the test message
            test_logger.log(test_logger.levels.info, "My Test Message")

            // Retrieve the spy and convert it to the correct type
            let test_spy = test_logger.winston_connection.log as SinonSpy

            // Verify that the log method was called
            assert(test_spy.called, "The log method was not called")

            // Verify that the arguments were correctly sent
            assert(test_spy.calledWith("info", "My Test Message"), "The log was not transformed correctly.")

        })

    })
   
})