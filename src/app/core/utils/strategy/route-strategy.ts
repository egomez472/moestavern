// custom-route-reuse-strategy.ts
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class Routetrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Aquí decides si debes guardar el componente
    return true; // Cambia esto según tus necesidades
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (route.routeConfig && route.routeConfig.path) {
      this.handlers[route.routeConfig.path] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!(route.routeConfig && route.routeConfig.path && this.handlers[route.routeConfig.path]);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.routeConfig && route.routeConfig.path) {
      return this.handlers[route.routeConfig.path];
    }
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
