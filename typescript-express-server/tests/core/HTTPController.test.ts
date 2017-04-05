import * as assert from "assert"
import { describe, after, afterEach, before, beforeEach, it } from "mocha"
import { SinonSpy, spy } from "sinon"

import { HTTPController } from "../../src/core/HTTPController"

describe("HTTPController", () => {

    let test_controller,
        mocked_router

    before(() => {

        // Create a mock of a router to check that the verbs are being called
        mocked_router = {
            get: spy(),
            post: spy(),
            patch: spy(),
            delete: spy(),
            head: spy()
        }

        test_controller = new HTTPController(mocked_router)

    })

    it("should mount a handler function to each of the four HTTP verbs", () => {

        // Ensure that all four spies were called with a function as their first argument
        assert.equal(typeof mocked_router.get.args[0][0], "function")
        assert.equal(typeof mocked_router.post.args[0][0], "function")
        assert.equal(typeof mocked_router.patch.args[0][0], "function")
        assert.equal(typeof mocked_router.delete.args[0][0], "function")
        assert.equal(typeof mocked_router.head.args[0][0], "function")
    
    })

    describe("handler functions", () => {

        let response_spy

        beforeEach(() => {

            response_spy = {
                sendStatus: spy()
            }

        })

        it("should respond to a GET request with a 404", () => {

            // Call the get method
            test_controller.get(null, response_spy)

            // Check that the status was 404
            assert(response_spy.sendStatus.calledWith(404))

        })

        it("should respond to a POST request with a 404", () => {

            // Call the post method
            test_controller.post(null, response_spy)

            // Check that the status was 404
            assert(response_spy.sendStatus.calledWith(404))

        })

        it("should respond to a PATCH request with a 404", () => {

            // Call the patch method
            test_controller.patch(null, response_spy)

            // Check that the status was 404
            assert(response_spy.sendStatus.calledWith(404))

        })

        it("should respond to a DELETE request with a 404", () => {

            // Call the delete method
            test_controller.delete(null, response_spy)

            // Check that the status was 404
            assert(response_spy.sendStatus.calledWith(404))

        })

        it("should respond to a HEAD request with a 404", () => {

            // Call the delete method
            test_controller.head(null, response_spy)

            // Check that the status was 404
            assert(response_spy.sendStatus.calledWith(404))

        })

    })

})