import express from 'express'
import CommonController from './common.controller'
import debug from 'debug'

const log: debug.IDebugger = debug('app:common-routes')

export default class CommonRoutesConfig {
    app: express.Application
    name: string

    constructor(app: express.Application, name: string) {
        this.app = app
        this.name = name
        this.configureRoutes()
    }

    getName() {
        return this.name
    }

    configureRoutes(): express.Application {
    
        this.app
            .route('/')
            .get(CommonController.getRouteName)
        
        return this.app
    }
}