import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {Injectable} from '@angular/core';

interface IRouteConfigData {
    reuse: boolean;
}

interface ICachedRoute {
    handle: DetachedRouteHandle;
    data: IRouteConfigData;
}


@Injectable()
export class AppReuseStrategy implements RouteReuseStrategy {
    private static routeCache = new Map<string, ICachedRoute>();
    private static waitDelete: string; // 当前页未进行存储时需要删除
    private static currentDelete: string;  // 当前页存储过时需要删除

    /* 用于删除路由快照*/
    public static deleteRouteSnapshot(url: string): void {
        if (url[0] === '/') {
            url = url.substring(1);
        }
        url = url.replace('/', '_');
        if (AppReuseStrategy.routeCache.has(url)) {
            AppReuseStrategy.routeCache.delete(url);
            AppReuseStrategy.currentDelete = url;
        } else {
            AppReuseStrategy.waitDelete = url;
        }
    }

    /** 进入路由触发，判断是否是同一路由 */
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断，这里判断是否有data数据判断是否复用
     * 在路由中添加格式为：{ path: '', component: VendorListComponent, data: {title: '商户列表', module: '/Vendor/List'}}
     * 在需要的路由下添加data数据，不需要复用的不添加
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const data = this.getRouteData(route);
        if (data) {
            return true;
        }
        return false;
    }

    /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const url = this.getFullRouteUrl(route);
        const data = this.getRouteData(route);
        if (AppReuseStrategy.waitDelete && AppReuseStrategy.waitDelete === url) {
            // 如果待删除是当前路由，且未存储过则不存储快照
            AppReuseStrategy.waitDelete = null;
            return null;
        } else {
            // 如果待删除是当前路由，且存储过则不存储快照
            if (AppReuseStrategy.currentDelete && AppReuseStrategy.currentDelete === url) {
                AppReuseStrategy.currentDelete = null;
                return null;
            } else {
                AppReuseStrategy.routeCache.set(url, { handle, data });
                this.addRedirectsRecursively(route);
            }
        }
    }

    /** 若 path 在缓存中有的都认为允许还原路由 */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const url = this.getFullRouteUrl(route);
        return AppReuseStrategy.routeCache.has(url);
    }

    /** 从缓存中获取快照，若无则返回nul */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        const url = this.getFullRouteUrl(route);
        const data = this.getRouteData(route);
        return data  && AppReuseStrategy.routeCache.has(url)
            ? AppReuseStrategy.routeCache.get(url).handle
            : null;
    }

    private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
        const config = route.routeConfig;
        if (config) {
            if (!config.loadChildren) {
                const routeFirstChild = route.firstChild;
                const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
                const childConfigs = config.children;
                if (childConfigs) {
                    const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
                    if (childConfigWithRedirect) {
                        childConfigWithRedirect.redirectTo = routeFirstChildUrl;
                    }
                }
            }
            route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
        }
    }

    private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
        return this.getFullRouteUrlPaths(route).filter(Boolean).join('/').replace('/', '_');
    }

    private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        const paths = this.getRouteUrlPaths(route);
        return route.parent ? [ ...this.getFullRouteUrlPaths(route.parent), ...paths ] : paths;
    }

    private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        return route.url.map(urlSegment => urlSegment.path);
    }

    private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
        return route.routeConfig && route.routeConfig.data as IRouteConfigData;
    }
}


// 譬如可以在home.component.ts中添加删除功能closeUrl()
// 关闭选项标签
// closeUrl(module: string, isSelect: boolean, event: Event) {
//     event.preventDefault();
//     // 当前关闭的是第几个路由
//     const index = this.menuList.findIndex(p => p.module === module);
//     // 如果只有一个不可以关闭
//     if (this.menuList.length === 1) return;
//     this.menuList = this.menuList.filter(p => p.module !== module);
//     // 删除复用
//     AppReuseStrategy.deleteRouteSnapshot(module);
//     if (!isSelect) return;
//     // 显示上一个选中
//     let menu = this.menuList[index - 1];
//     if (!menu) {// 如果上一个没有下一个选中
//         menu = this.menuList[index];
//     }
//     this.menuList.forEach(p => p.isSelect = p.module === menu.module);
//    // 显示当前路由信息
//     this.router.navigate(['/' + menu.module]);
// }
