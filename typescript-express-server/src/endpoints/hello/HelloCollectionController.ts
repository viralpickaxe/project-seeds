import { HTTPController } from "../../core/HTTPController"
import * as Express from "express"

export class HelloCollectionController extends HTTPController {

    get(req: Express.Request, res: Express.Response): void {

		res
			.status(200)
			.json({
				hello: "world"
			})

	}

}