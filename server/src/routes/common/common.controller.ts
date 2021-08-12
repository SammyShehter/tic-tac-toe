import express from 'express'
import { error } from './common.functions'
import debug from 'debug'

const log: debug.IDebugger = debug('app:common-controller')

class CommonController {
    public getRouteName = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            return res
                .status(200)
                .send(
                    'The name is "Common Route". The route is configured and ready to use'
                )
        } catch (e) {
            return error(e, req, res)
        }
    }
}

export default new CommonController()
