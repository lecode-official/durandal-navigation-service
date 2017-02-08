///<amd-module name='Navigation/NavigationService'/>
define("Navigation/NavigationService", ["require", "exports", "durandal/app", "Navigation/ActiveRoute", "jquery", "knockout", "Navigation/Route", "plugins/router", "durandal/viewLocator"], function (require, exports, app, ActiveRoute, jquery, knockout, Route, router, viewLocator) {
    "use strict";
    // #endregion
    /**
     * Represents a service that is used to navigate throughout the web application.
     */
    var NavigationService = (function () {
        function NavigationService() {
        }
        Object.defineProperty(NavigationService, "isNavigating", {
            // #endregion
            // #region Public Static Properties
            /**
             * Gets a value that determines whether the navigation service is currently navigating.
             */
            get: function () {
                return NavigationService._isNavigating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationService, "activeRoute", {
            /**
             * Gets the route that is currently active, and a set of parameters of the route.
             */
            get: function () {
                // Initializes the computed if it does not exist
                if (!NavigationService._activeRoute) {
                    NavigationService._activeRoute = knockout.computed(function () {
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
                        return new ActiveRoute(NavigationService.routes[NavigationService.routeNames[moduleId].name], NavigationService.isPushStateEnabled ? router.activeInstruction().fragment : "#" + router.activeInstruction().fragment, router.activeInstruction().config.route, router.activeInstruction().params, router.activeInstruction().queryParams);
                    });
                }
                // Returns the computed
                return NavigationService._activeRoute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationService, "routes", {
            /**
             * Gets all routes that have been added to the navigation service.
             */
            get: function () {
                // Generates the navigation model if it hasn't already been generated
                if (!NavigationService._routes) {
                    // Builds the navigation model of the Durandal router
                    router.buildNavigationModel();
                    // Initializes the backing field
                    NavigationService._routes = {};
                    // Gets the naviation model from the router and wraps the items into Route objects (if push state is enabled, the "hash" that is given to the Route object should not contain "#!")
                    router.navigationModel().forEach(function (route) {
                        if (!!route.moduleId) {
                            NavigationService._routes[NavigationService.routeNames[route.moduleId].name] = new Route(NavigationService.routeNames[route.moduleId].name, route.title, NavigationService.routeNames[route.moduleId].paths, !!route.isActive ? route.isActive : knockout.computed(function () { return false; }), NavigationService.configuration.addCultureToUris);
                        }
                    });
                }
                // Returns the stored routes
                return NavigationService._routes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationService, "shell", {
            /**
             * Gets the shell of the navigation service.
             */
            get: function () {
                return NavigationService._shell;
            },
            enumerable: true,
            configurable: true
        });
        // #endregion
        // #region Public Static Methods
        /**
         * Configures the durandal system so that the view-model-view convention of naming files is used.
         * @param {NavigationConfiguration} configuration The configuration that the navigation service should use.
         */
        NavigationService.use = function (configuration) {
            var _this = this;
            // Sets the configuration
            NavigationService.configuration = configuration;
            // Overrides the default behavior of the view locator when determining the ID of the view for a given view model ID (when the view model ID is "ViewModels/IndexViewModel", then the returned view ID is "Views/Index"
            viewLocator.convertModuleIdToViewId = function (moduleId) { return moduleId.replace("ViewModels", "Views").replace("ViewModel", ""); };
            // Overrides the default document title style
            router.updateDocumentTitle = function (instance, instruction) {
                if (instruction.config.title) {
                    if (app.title) {
                        document.title = app.title + " / " + instruction.config.title;
                    }
                    else {
                        document.title = instruction.config.title;
                    }
                }
                else if (app.title) {
                    document.title = app.title;
                }
            };
            // Subscribes for changes in the router's active instruction
            router.activeInstruction.subscribe(function () { return _this.activeRoute.peek(); });
        };
        /**
         * Adds a new route to the navigation service.
         * @param {string} name The name of the route (this will be used to generate the module ID that is loaded).
         * @param {string} title The title of the route.
         * @param {Array<string>} paths The paths that should map to this route. If no paths are provided, the route will catch all unknown paths.
         */
        NavigationService.addRoute = function (name, title) {
            var paths = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                paths[_i - 2] = arguments[_i];
            }
            // Checks whether push state is not supported
            if (!!paths && !NavigationService.isPushStateEnabled) {
                // Adds !-characters to the paths if push state is not supported
                paths = paths.map(function (path) { return "!" + path; });
                // If the paths contained an empty path (for the default view), then another entry without !-character is provided
                if (paths.some(function (path) { return path === "!"; })) {
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
        };
        /**
         * Navigates back to the last route that has been active.
         */
        NavigationService.navigateBack = function () {
            // Uses the router to navigate back
            router.navigateBack();
        };
        /**
         * Activates the navigation service, which should be called in the activate method of the shell view model.
         * @param {any} shell The shell view model that is the root of all view models.
         * @return {JQueryPromise<any>} Returns a promise that resolves as soon as the navigation service is activated.
         */
        NavigationService.activate = function (shell) {
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
            }
            else {
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
        };
        /**
         * Scrolls to the top of the page.
         */
        NavigationService.scrollToTop = function () {
            // Scrolls to the anchor of the page
            jquery("html,body").animate({ scrollTop: 0 }, 600);
        };
        /**
         * Scrolls to an anchor of the page.
         * @param {string} anchor The anchor to which the page is scrolled.
         */
        NavigationService.scrollTo = function (anchor) {
            // Scrolls to the anchor of the page
            try {
                jquery("html,body").animate({ scrollTop: jquery("#" + anchor).offset().top }, 600);
            }
            catch (Exception) { }
        };
        /**
         * Checks whether the element with the provided anchor is in the current view.
         * @param {string} anchor The anchor which is searched for.
         * @return {boolean} Returns a value that determines whether the element with the provided anchor is in the current view.
         */
        NavigationService.isInViewport = function (anchor) {
            // Checks if the element is within the viewport
            try {
                return jquery("#" + anchor).offset().top - jquery(window).scrollTop() <= jquery(window).height() && jquery("#" + anchor).offset().top - jquery(window).scrollTop() + jquery("#" + anchor).height() > 0;
            }
            catch (Exception) {
                return false;
            }
        };
        return NavigationService;
    }());
    // #region Private Static Fields
    /**
     * Contains a value that determines whether push state is supported by the browser
     */
    NavigationService.isPushStateEnabled = !!(window.history && history.pushState);
    /**
     * Contains a dictionary of the module ID and the name of the route. This is used to get the name from a module ID.
     */
    NavigationService.routeNames = {};
    /**
     * Contains the shell that uses the navigation service.
     */
    NavigationService._shell = null;
    /**
     * Contains a value that determines whether the navigation service is currently navigating.
     */
    NavigationService._isNavigating = router.isNavigating;
    return NavigationService;
});
