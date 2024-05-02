/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as BookingsImport } from './routes/bookings'
import { Route as IndexImport } from './routes/index'
import { Route as PropertiesPropertyIdImport } from './routes/properties/$propertyId'

// Create/Update Routes

const BookingsRoute = BookingsImport.update({
  path: '/bookings',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PropertiesPropertyIdRoute = PropertiesPropertyIdImport.update({
  path: '/properties/$propertyId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/bookings': {
      preLoaderRoute: typeof BookingsImport
      parentRoute: typeof rootRoute
    }
    '/properties/$propertyId': {
      preLoaderRoute: typeof PropertiesPropertyIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  BookingsRoute,
  PropertiesPropertyIdRoute,
])

/* prettier-ignore-end */
