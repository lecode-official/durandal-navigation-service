
// #region Import Directives

/// <reference path="../../Resources/Typings/References.d.ts" />

import router = require("plugins/router");
import CultureDetectionMethod = require("Services/Culture/CultureDetectionMethod");
import CultureInfo = require("Services/Culture/CultureInfo");
import CultureService = require("Services/Culture/CultureService");
import Route = require("Services/Navigation/Route");

// #endregion

/**
 * Represents a route of the navigation service, which is currently active with a defined set of parameters.
 */
class ActiveRoute {
    
    // #region Constructors

    /**
     * Initializes a new ActiveRoute instance.
     * @param {Route} route The route that is active.
     * @param {string} fragment The fragment that is used to navigate via router or generate a link to the route's page.
     * @param {string} path The path of the route.
     * @param {Array<any>} parameters The parameters of the route path.
     * @param {{ [key: string]: any; }} queryParameters The query parameters that have been retrieved via URL query parameters.
     */
    constructor(route: Route, fragment: string, path: string, parameters: Array<any>, queryParameters: { [key: string]: any; }) {
        this._route = route;
        this.fragment = fragment;
        this._parameters = this.generateParameters(path, parameters, queryParameters);
    }

    // #endregion

    // #region Private Fields

    /**
     * Contains the fragment that is used to navigate via router or generate a link to the route's page.
     */
    private fragment: string;

    /**
     * Contains the route that is active.
     */
    private _route: Route;

    /**
     * Contains all parameters of the route.
     */
    private _parameters: { [key: string]: any; };

    // #endregion

    // #region Public Properties

    /**
     * Gets the route that is active.
     */
    public get route(): Route {
        return this._route;
    }

    /**
     * Gets all parameters of the route.
     */
    public get parameters(): { [key: string]: any; } {
        return this._parameters;
    }

    /**
     * Gets the active view model.
     */
    public get viewModel(): any {
        return router.activeItem();
    }
    
    // #endregion
    
    // #region Private Methods

    /**
     * Generates a dictionary of all parameters.
     * @param {string} path The path of the route.
     * @param {Array<any>} parameters The parameters of the route path.
     * @param {{ [key: string]: any; }} queryParameters The query parameters that have been retrieved via URL query parameters.
     * @return {{ [key: string]: any }} Returns a dictionary with all parmeters.
     */
    private generateParameters(path: string, parameters: Array<any>, queryParameters: { [key: string]: any; }): { [key: string]: any } {

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
            matches.forEach(parameter => {

                // Removes the ":" to get the actual parameter name (e.g. ":id" => "id")
                queryParameters[parameter.substr(1)] = parameters[i];
                i++;
            });
        }

        // Returns the dictionary
        return queryParameters;
    }

    // #endregion

    // #region Public Methods

    /**
     * Generates a URL href that can be used in links that should navigate to the route.
     * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
     * @return {string} Returns the href link that can be used in views to navigate to the route.
     */
    public href(cultureOrAbsolute?: CultureInfo | boolean): string {

        // Initializes the base path depending on the culture parameter
        var basePath = "/";
        if (!!cultureOrAbsolute) {
            if (typeof cultureOrAbsolute === "boolean") {
                basePath = window.location.protocol + "//" + window.location.host + "/" + (CultureService.detectionMethod == CultureDetectionMethod.Uri ? CultureService.currentCulture.name + "/" : "");
            } else {
                basePath = window.location.protocol + "//" + window.location.host + "/" + cultureOrAbsolute.name + "/";
            }
        }

        // Returns the link
        return basePath + this.fragment;
    }
    
    /**
     * Navigates to the route.
     * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
     */
    public navigate(cultureOrAbsolute?: CultureInfo | boolean) {
        
        // Checks whether a culture is provided, so a redirect has to be made
        if (!!cultureOrAbsolute) {
            if (typeof cultureOrAbsolute === "boolean") {
                window.location.href = this.href(cultureOrAbsolute);
                return;
            } else {
                window.location.href = this.href(cultureOrAbsolute);
                return;
            }
        }

        // Navigates to the fragment
        router.navigate(this.fragment);
    }

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = ActiveRoute;