
///<amd-module name='Navigation/NavigationService'/>

// #region Import Directives

/// <reference path="../Typings/References.d.ts" />

import app = require("durandal/app");
import ActiveRoute = require("Navigation/ActiveRoute");
import jquery = require("jquery");
import knockout = require("knockout");
import NavigationConfiguration = require("Navigation/NavigationConfiguration");
import Route = require("Navigation/Route");
import router = require("plugins/router");
import viewLocator = require("durandal/viewLocator");

// #endregion

/**
 * Represents a service that is used to navigate throughout the web application.
 */
class NavigationService {

    // #region Private Static Fields

    /**
     * Contains a value that determines whether push state is supported by the browser
     */
    private static isPushStateEnabled: boolean = !!(window.history && history.pushState);

    /**
     * Contains a dictionary of the module ID and the name of the route. This is used to get the name from a module ID.
     */
    private static routeNames: { [moduleId: string]: { name: string; paths: Array<string> }; } = {};

    /**
     * Contains all routes that have been added to the navigation service.
     */
    private static _routes: { [name: string]: Route; };

    /**
     * Contains the shell that uses the navigation service.
     */
    private static _shell: any = null;

    /**
     * Contains a value that determines whether the navigation service is currently navigating.
     */
    private static _isNavigating: KnockoutComputed<boolean> = router.isNavigating;

    /**
     * Contains the route that is currently active, and a set of parameters of the route.
     */
    private static _activeRoute: KnockoutComputed<ActiveRoute|null>;
    
    /**
     * Contains the current configuration of the navigation service.
     */
    private static configuration: NavigationConfiguration;

    // #endregion

    // #region Public Static Properties

    /**
     * Gets a value that determines whether the navigation service is currently navigating.
     */
    public static get isNavigating(): KnockoutComputed<boolean> {
        return NavigationService._isNavigating;
    } 

    /**
     * Gets the route that is currently active, and a set of parameters of the route.
     */
    public static get activeRoute(): KnockoutComputed<ActiveRoute|null> {

        // Initializes the computed if it does not exist
        if (!NavigationService._activeRoute) {
            NavigationService._activeRoute = knockout.computed(() => {

                // Returns null if the router has no active instruction
                if (!router.activeInstruction()) {
                    return null;
                }

                // Checks if the active route has a module ID
                var moduleId = router.activeInstruction().config.moduleId;
                if (!moduleId) {
                    return null;
                }

                // Returns the route that is active
                return new ActiveRoute(
                    NavigationService.routes[NavigationService.routeNames[moduleId].name],
                    NavigationService.isPushStateEnabled ? router.activeInstruction().fragment : "#" + router.activeInstruction().fragment,
                    <string>router.activeInstruction().config.route,
                    router.activeInstruction().params,
                    router.activeInstruction().queryParams);
            });
        }

        // Returns the computed
        return NavigationService._activeRoute;
    }

    /**
     * Gets all routes that have been added to the navigation service.
     */
    public static get routes(): { [name: string]: Route; } {

        // Generates the navigation model if it hasn't already been generated
        if (!NavigationService._routes) {

            // Builds the navigation model of the Durandal router
            router.buildNavigationModel();

            // Initializes the backing field
            NavigationService._routes = {};

            // Gets the naviation model from the router and wraps the items into Route objects (if push state is enabled, the "hash" that is given to the Route object should not contain "#!")
            router.navigationModel().forEach(route => {
                if (!!route.moduleId) {
                    NavigationService._routes[NavigationService.routeNames[route.moduleId].name] = new Route(
                        NavigationService.routeNames[route.moduleId].name,
                        route.title,
                        NavigationService.routeNames[route.moduleId].paths,
                        !!route.isActive ? route.isActive : knockout.computed(() => false),
                        NavigationService.configuration.addCultureToUris);
                }
            });  
        }

        // Returns the stored routes
        return NavigationService._routes;
    }

    /**
     * Gets the shell of the navigation service.
     */
    public static get shell(): any {
        return NavigationService._shell;
    }
    
    // #endregion

    // #region Public Static Methods

    /**
     * Configures the durandal system so that the view-model-view convention of naming files is used.
     * @param {NavigationConfiguration} configuration The configuration that the navigation service should use.
     */
    public static use(configuration: NavigationConfiguration) {

        // Sets the configuration
        NavigationService.configuration = configuration;

        // Overrides the default behavior of the view locator when determining the ID of the view for a given view model ID (when the view model ID is "ViewModels/IndexViewModel", then the returned view ID is "Views/Index"
        viewLocator.convertModuleIdToViewId = moduleId => moduleId.replace("ViewModels", "Views").replace("ViewModel", "");

        // Overrides the default document title style
        router.updateDocumentTitle = function (instance, instruction) {
            if (instruction.config.title) {
                if (app.title) {
                    document.title = app.title + " / " + instruction.config.title;
                } else {
                    document.title = instruction.config.title;
                }
            } else if (app.title) {
                document.title = app.title;
            }
        };

        // Subscribes for changes in the router's active instruction
        router.activeInstruction.subscribe(() => this.activeRoute.peek());
    }

    /**
     * Adds a new route to the navigation service.
     * @param {string} name The name of the route (this will be used to generate the module ID that is loaded).
     * @param {string} title The title of the route.
     * @param {Array<string>} paths The paths that should map to this route. If no paths are provided, the route will catch all unknown paths.
     */
    public static addRoute(name: string, title: string, ...paths: Array<string>) {
        
        // Checks whether push state is not supported
        if (!!paths && !NavigationService.isPushStateEnabled) {

            // Adds !-characters to the paths if push state is not supported
            paths = paths.map(path => "!" + path);

            // If the paths contained an empty path (for the default view), then another entry without !-character is provided
            if (paths.some(path => path === "!")) {
                paths.push("");
            }
        }
        
        // Adds the route to the list of route names, so that the name can be determined by the routes property later on
        NavigationService.routeNames["ViewModels/" + name + "ViewModel"] = { name: name, paths: paths };

        // Adds the route to the map of the router
        router.map({
            title: title,
            moduleId: "ViewModels/" + name + "ViewModel",
            route: paths,
            nav: true
        });

        // If no paths have been provided, this route is the fallback for all unknown requests
        if (!paths || paths.length == 0) {
            router.mapUnknownRoutes("ViewModels/" + name + "ViewModel");
        }
    }
    
    /**
     * Navigates back to the last route that has been active.
     */
    public static navigateBack() {

        // Uses the router to navigate back
        router.navigateBack();
    }

    /**
     * Activates the navigation service, which should be called in the activate method of the shell view model.
     * @param {any} shell The shell view model that is the root of all view models.
     * @return {JQueryPromise<any>} Returns a promise that resolves as soon as the navigation service is activated.
     */
    public static activate(shell: any): JQueryPromise<any> {

        // Stores the shell view model
        this._shell = shell;

        // Checks whether an explicit culture is required from the path, so that the root path of the application changes
        var root = "";
        var path = "";
        var search = window.location.search;
        if (!!window.location.pathname && window.location.pathname.substr(1).length > 0) {

            // Removes /-character at the start or end of the path
            if (path.length > 0 && path.charAt(0) == "/") {
                path = path.substr(1);
            }
            if (path.length > 0 && path.charAt(path.length - 1) == "/") {
                path = path.substring(0, 1);
            }
        }

        // Checks whether an explicit root has been configured
        if (!!NavigationService.configuration.rootPath) {
            root = NavigationService.configuration.rootPath;
        }

        // Checks whether push state is enabled
        if (NavigationService.isPushStateEnabled) {
            
            // Checks whether a start route has been configured
            if (!!NavigationService.configuration.startRoute) {

                // Activates the router with push state
                return router.activate({ hashChange: false, pushState: true, root: root, startRoute: this.routes[NavigationService.configuration.startRoute].href() });
            }

            // Checks whether the location of the windows contains a hash with a !-character, then the path for the push state has to be generated
            if (!!window.location.hash && window.location.hash.substr(0, 2) === "#!") {

                // Activates the router with push state (siliently, which means no view is loaded) and navigates to the destination via push state
                return router.activate({ hashChange: false, pushState: true, silent: true, root: root, startRoute: location.hash.substr(2) });
            }

            // Activates the router with push state
            return router.activate({ hashChange: false, pushState: true, root: root });
        } else {

            // Checks whether a start route has been configured
            if (!!NavigationService.configuration.startRoute) {
                
                // Activates the router with hash change
                return router.activate({ startRoute: "#!" + NavigationService.configuration.startRoute });
            }

            // Checks whether the location of the windows contains a path, then the path has to be translated to the hash
            if (path.length > 0 || search.length > 0) {

                // Activates the router with the path name as start route
                return router.activate({ startRoute: "#!" + path + search });
            }

            // Activates the router with hash change
            return router.activate();
        }
    }

    /**
     * Scrolls to the top of the page.
     */
    public static scrollToTop() {

        // Scrolls to the anchor of the page
        jquery("html,body").animate({ scrollTop: 0 }, 600);
    }

    /**
     * Scrolls to an anchor of the page.
     * @param {string} anchor The anchor to which the page is scrolled.
     * @param {number} offset The offset of the scroll action.
     */
    public static scrollTo(anchor: string, offset?: number) {
        
        // Scrolls to the anchor of the page
        try {
            jquery("html,body").animate({ scrollTop: jquery("#" + anchor).offset().top + (!!offset ? offset : 0) }, 600);
        } catch (Exception) { }
    }

    /**
     * Scrolls to an anchor of the page, which may be defined by a selector.
     * @param {string} selector The selector to which the page is scrolled.
     * @param {number} offset The offset of the scroll action.
     */
    public static scrollToSelector(selector: string, offset?: number) {
        
        // Scrolls to the selector on the page
        try {
            jquery("html,body").animate({ scrollTop: jquery(selector).offset().top + (!!offset ? offset : 0) }, 600);
        } catch (Exception) { }
    }

    /**
     * Checks whether the element with the provided anchor is in the current view.
     * @param {string} anchor The anchor which is searched for.
     * @return {boolean} Returns a value that determines whether the element with the provided anchor is in the current view.
     */
    public static isInViewport(anchor: string): boolean {

        // Checks if the element is within the viewport
        try {
            return jquery("#" + anchor).offset().top - jquery(window).scrollTop() <= jquery(window).height() && jquery("#" + anchor).offset().top - jquery(window).scrollTop() + jquery("#" + anchor).height() > 0;
        } catch (Exception) {
            return false;
        }
    }

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = NavigationService;