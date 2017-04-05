import * as assert from "assert"
import { describe, after, afterEach, before, beforeEach, it } from "mocha"
import { SinonSpy, spy } from "sinon"

import { LogLevel } from "../../src/core/LogLevel"
import axios from "axios"
import * as Winston from "winston"

describe("LogLevel", () => {

    it("should save the provided LogLevel", () => {

        // Create a test instance 
        let test_log_level = new LogLevel("test")

        // Check that the level is set correctly
        assert.equal(test_log_level.get(), "test", "The log level was not returned correctly")

    })

})