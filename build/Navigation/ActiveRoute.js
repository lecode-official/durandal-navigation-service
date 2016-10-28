///<amd-module name='Navigation/ActiveRoute'/>
define("Navigation/ActiveRoute", ["require", "exports", "plugins/router", "Globalization/CultureInfo"], function (require, exports, router, CultureInfo) {
    "use strict";
    // #endregion
    /**
     * Represents a route of the navigation service, which is currently active with a defined set of parameters.
     */
    var ActiveRoute = (function () {
        // #region Constructors
        /**
         * Initializes a new ActiveRoute instance.
         * @param {Route} route The route that is active.
         * @param {string} fragment The fragment that is used to navigate via router or generate a link to the route's page.
         * @param {string} path The path of the route.
         * @param {Array<any>} parameters The parameters of the route path.
         * @param {{ [key: string]: any; }} queryParameters The query parameters that have been retrieved via URL query parameters.
         */
        function ActiveRoute(route, fragment, path, parameters, queryParameters) {
            this._route = route;
            this.fragment = fragment;
            this._parameters = this.generateParameters(path, parameters, queryParameters);
        }
        Object.defineProperty(ActiveRoute.prototype, "route", {
            // #endregion
            // #region Public Properties
            /**
             * Gets the route that is active.
             */
            get: function () {
                return this._route;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActiveRoute.prototype, "parameters", {
            /**
             * Gets all parameters of the route.
             */
            get: function () {
                return this._parameters;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActiveRoute.prototype, "viewModel", {
            /**
             * Gets the active view model.
             */
            get: function () {
                return router.activeItem();
            },
            enumerable: true,
            configurable: true
        });
        // #endregion
        // #region Private Methods
        /**
         * Generates a dictionary of all parameters.
         * @param {string} path The path of the route.
         * @param {Array<any>} parameters The parameters of the route path.
         * @param {{ [key: string]: any; }} queryParameters The query parameters that have been retrieved via URL query parameters.
         * @return {{ [key: string]: any }} Returns a dictionary with all parmeters.
         */
        ActiveRoute.prototype.generateParameters = function (path, parameters, queryParameters) {
            // Initializes the parameters
            if (!queryParameters) {
                queryParameters = {};
            }
            if (!parameters) {
                parameters = [];
            }
            // Matches all parameters in the path
            var matches = path.match(new RegExp(":[a-zA-Z_][0-9a-zA-Z_]*", "g"));
            if (matches != null) {
                var i = 0;
                matches.forEach(function (parameter) {
                    // Removes the ":" to get the actual parameter name (e.g. ":id" => "id")
                    queryParameters[parameter.substr(1)] = parameters[i];
                    i++;
                });
            }
            // Returns the dictionary
            return queryParameters;
        };
        // #endregion
        // #region Public Methods
        /**
         * Generates a URL href that can be used in links that should navigate to the route.
         * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
         * @return {string} Returns the href link that can be used in views to navigate to the route.
         */
        ActiveRoute.prototype.href = function (cultureOrAbsolute) {
            // Initializes the base path depending on the culture parameter
            var basePath = "/";
            if (!!cultureOrAbsolute) {
                if (typeof cultureOrAbsolute === "boolean") {
                    basePath = window.location.protocol + "//" + window.location.host + "/" + (this.route.addCultureToUri ? CultureInfo.currentCulture.name + "/" : "");
                }
                else {
                    basePath = window.location.protocol + "//" + window.location.host + "/" + cultureOrAbsolute.name + "/";
                }
            }
            // Returns the link
            return basePath + this.fragment;
        };
        /**
         * Navigates to the route.
         * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
         */
        ActiveRoute.prototype.navigate = function (cultureOrAbsolute) {
            // Checks whether a culture is provided, so a redirect has to be made
            if (!!cultureOrAbsolute) {
                if (typeof cultureOrAbsolute === "boolean") {
                    window.location.href = this.href(cultureOrAbsolute);
                    return;
                }
                else {
                    window.location.href = this.href(cultureOrAbsolute);
                    return;
                }
            }
            // Navigates to the fragment
            router.navigate(this.fragment);
        };
        return ActiveRoute;
    }());
    return ActiveRoute;
});
