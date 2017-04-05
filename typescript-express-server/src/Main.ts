import { HTTPServer } from "./core/HTTPServer"
import { ServerRuntime } from "./core/ServerRuntime"
import { json } from "body-parser"
import { HTTPAccessLog } from "./core/HTTPAccessLog"
import { defaultLogger } from "./core/Logger"

// Non Typescript imports
var cors = require("cors")

// Map the Heroku PORT variable if available - otherwise default to 4000
let port = process.env.PORT || 3000

// Create a HTTP Server to use
let http_server = new HTTPServer(port)

// Enable the helmet protection as this is a public facing API
http_server.enableHelmetProtections()

// Create an Access log
let access_log = new HTTPAccessLog(defaultLogger)

// Mount the access log
http_server.getApplication().use(access_log.middleware())

// Mount the body parser
http_server.getApplication().use(json())

// Mount the cors middleware
http_server.getApplication().use(cors())

// Import controllers
import { HelloCollectionController } from "./endpoints/hello/HelloCollectionController"

// Attach the controllers for endpoints
http_server.mount("/hello", HelloCollectionController)

// Start the HTTP server
http_server.start()

// Create a HTTP Runtime to run this server - use default grace periods for Heroku
new ServerRuntime(http_server)