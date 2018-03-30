
///<amd-module name='durandal-navigation-service/Route'/>

// #region Import Directives

/// <reference types="durandal-globalization" />

import router = require("plugins/router");
import CultureInfo = require("durandal-globalization/CultureInfo");

// #endregion

/**
 * Represents a route of the navigation service, which can be used to determine the state of the route or generate a link to the route.
 */
class Route {

    // #region Constructors

    /**
     * Initializes a new Route instance.
     * @param {string} name The name of the route.
     * @param {string} title The title of the route, which is displayed in the title bar of the browser.
     * @param {Array<string>} paths All paths that match the route.
     * @param {KnockoutComputed<boolean>} isActive A value that determines whether the route is currently active.
     * @param {boolean} addCultureToUri A value that determines whether the culture should be added to the URL of the route.
     */
    constructor(name: string, title: string, paths: Array<string>, isActive: KnockoutComputed<boolean>, addCultureToUri: boolean) {
        this.paths = this.generatePaths(paths);
        this._name = name;
        this._title = title;
        this._isActive = isActive;
        this._addCultureToUri = addCultureToUri;
    }

    // #endregion

    // #region Private Fields

    /**
     * Contains all paths that match the route.
     */
    private paths: { [key: string]: Array<string> };

    /**
     * Contains the name of the route.
     */
    private _name: string;

    /**
     * Contains the title of the route, which is displayed in the title bar of the browser.
     */
    private _title: string;

    /**
     * Contains a value that determines whether the route is currently active.
     */
    private _isActive: KnockoutComputed<boolean>;

    /**
     * Contains a value that indicates whether the culture should be added to the URL of the route.
     */
    private _addCultureToUri: boolean;

    // #endregion

    // #region Public Properties

    /**
     * Gets the name of the route.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Gets the title of the route, which is displayed in the title bar of the browser.
     */
    public get title(): string {
        return this._title;
    }

    /**
     * Gets a value that determines whether the route is currently active.
     */
    public get isActive(): KnockoutComputed<boolean> {
        return this._isActive;
    }

    /**
     * Gets a value that indicates whether the culture is added to the URL of the route.
     */
    public get addCultureToUri(): boolean {
        return this._addCultureToUri;
    }

    // #endregion

    // #region Private Methods

    /**
     * Generates a dictionary of paths and their parameter names.
     * @param {Array<string>} paths The list of paths.
     * @return {{ [key: string]: Array<string> }} Returns a dictionary with a list of paths and their parameter names.
     */
    private generatePaths(paths: Array<string>): { [key: string]: Array<string> } {

        // Initializes the dictionary of generated paths
        var generatedPaths: { [key: string]: Array<string> } = {};

        // Cycles over all paths and adds them to the dictionary
        paths.forEach(path => {

            // Matches all parameters in the path
            var parameterNames = new Array<string>();
            var matches = path.match(new RegExp(":[a-zA-Z_][0-9a-zA-Z_]*", "g"));
            if (matches != null) {
                matches.forEach(parameter => {

                    // Removes the ":" to get the actual parameter name (e.g. ":id" => "id")
                    parameterNames.push(parameter.substr(1));
                });
            }

            // Sets the parameter names
            generatedPaths[path] = parameterNames;
        });

        // Returns the dictionary
        return generatedPaths;
    }

    /**
     * Generates a URI which can be used to navigate to the route.
     * @param {{ [key: string]: any }} parameters The parameters that are used to navigate to the route.
     * @return {string} Returns the generated URI.
     */
    private generateUri(parameters: { [key: string]: any }): string {

        // Searches for all paths that match the specified parameters (if a path has a parameter that is not present in the given list, the path cannot be used)
        var fittingPaths = new Array<string>();
        for (var path in this.paths) {
            if (this.paths[path].every(p => !!parameters[p])) {
                fittingPaths.push(path);
            }
        }

        // If no fitting path has been found, the base path is returned.
        if (fittingPaths.length == 0) {
            return "";
        }

        // Gets the path with the most parameters
        var fittingPath = fittingPaths.sort((a, b) => this.paths[a].length > this.paths[b].length ? -1 : 1)[0];

        // Adds all the parameters
        fittingPath = fittingPath.replace(new RegExp(":[a-zA-Z_][0-9a-zA-Z_]*", "g"), parameter => {

            // Removes the ":" to get the actual parameter name (e.g. ":id" => "id")
            var parameterName = parameter.substr(1);

            // Gets the value of the parameter from the parameters bag, and removes it, so that it is not added again as a query parameter
            var replacement = parameters[parameterName];
            delete parameters[parameterName];

            // URI encodes the value and fills it into the path
            return encodeURIComponent(replacement);
        });

        // Adds all the query parameters (all the path parameters have been removed from the parameters bag, the remaining parameters are added as query parameters to the URI)
        var queryParameters = new Array<string>();
        for (var parameter in parameters) {
            if (parameters[parameter] != null) {
                queryParameters.push(parameter + "=" + encodeURIComponent(parameters[parameter]));
            }
        }

        // Returns the generated path
        return fittingPath + (queryParameters.length > 0 ? "?" + queryParameters.join("&") : "");
    }

    // #endregion

    // #region Public Methods

    /**
     * Generates a URL href that can be used in links that should navigate to the route.
     * @param {{ [key: string]: any; } | string} parameters If a string parameter is specified, it is used as ":id" parameter in the route. Providing a dictionary, all route parameters can be specified.
     * @param {CultureInfo | boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
     * @return {string} Returns the href link that can be used in views to navigate to the route.
     */
    public href(parameters?: { [key: string]: any; } | string, cultureOrAbsolute?: CultureInfo | boolean): string {

        // Initializes the base path depending on the culture parameter
        var basePath = "/";
        if (!!cultureOrAbsolute) {
            if (typeof cultureOrAbsolute === "boolean") {
                basePath = window.location.protocol + "//" + window.location.host + "/" + (this.addCultureToUri ? CultureInfo.currentCulture.name + "/" : "");
            } else {
                basePath = window.location.protocol + "//" + window.location.host + "/" + cultureOrAbsolute.name + "/";
            }
        }

        // Checks whether the parameters are provided, otherwise the hash is used without any replacement
        if (!parameters) {
            return basePath + this.generateUri({});
        }

        // If the parameters object is a simple string, it is used to replace the "id" parameter
        if (typeof parameters === "string") {
            return basePath + this.generateUri({ "id": parameters });
        } else {
            return basePath + this.generateUri(parameters);
        }
    }

    /**
     * Navigates to the route.
     * @param {{ [key: string]: string; } | string} parameters If a string parameter is specified, it is used as ":id" parameter in the route. Providing a dictionary, all route parameters can be specified.
     * @param {CultureInfo | boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
     */
    public navigate(parameters?: { [key: string]: any; } | string, cultureOrAbsolute?: CultureInfo | boolean) {

        // Checks whether a culture is provided, so a redirect has to be made
        if (!!cultureOrAbsolute) {
            if (typeof cultureOrAbsolute === "boolean") {
                window.location.href = this.href(parameters, cultureOrAbsolute);
                return;
            } else {
                window.location.href = this.href(parameters, cultureOrAbsolute);
                return;
            }
        }

        // Checks whether the parameters are provided, otherwise the hash is used for navigation without any replacement
        if (!parameters) {
            router.navigate(this.generateUri({}));
            return;
        }

        // If the parameters object is a simple string, it is used to replace the "id" parameter
        if (typeof parameters === "string") {
            router.navigate(this.generateUri({ "id": parameters }));
        } else {
            router.navigate(this.generateUri(parameters));
        }
    }

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = Route;