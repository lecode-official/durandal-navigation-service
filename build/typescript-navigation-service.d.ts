
/// <reference path="../../bower_components/DefinitelyTyped/jquery/index.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/durandal/index.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/knockout/index.d.ts" />
/// <reference path="../../bower_components/typescript-globalization/build/typescript-globalization.d.ts" />declare module 'Navigation/ActiveRoute' {
	/// <reference path="../Typings/References.d.ts" />
	import CultureInfo = require("Globalization/CultureInfo");
	import Route = require("Navigation/Route"); class ActiveRoute {
	    /**
	     * Initializes a new ActiveRoute instance.
	     * @param {Route} route The route that is active.
	     * @param {string} fragment The fragment that is used to navigate via router or generate a link to the route's page.
	     * @param {string} path The path of the route.
	     * @param {Array<any>} parameters The parameters of the route path.
	     * @param {{ [key: string]: any; }} queryParameters The query parameters that have been retrieved via URL query parameters.
	     */
	    constructor(route: Route, fragment: string, path: string, parameters: Array<any>, queryParameters: {
	        [key: string]: any;
	    });
	    /**
	     * Contains the fragment that is used to navigate via router or generate a link to the route's page.
	     */
	    private fragment;
	    /**
	     * Contains the route that is active.
	     */
	    private _route;
	    /**
	     * Contains all parameters of the route.
	     */
	    private _parameters;
	    /**
	     * Gets the route that is active.
	     */
	    readonly route: Route;
	    /**
	     * Gets all parameters of the route.
	     */
	    readonly parameters: {
	        [key: string]: any;
	    };
	    /**
	     * Gets the active view model.
	     */
	    readonly viewModel: any;
	    /**
	     * Generates a dictionary of all parameters.
	     * @param {string} path The path of the route.
	     * @param {Array<any>} parameters The parameters of the route path.
	     * @param {{ [key: string]: any; }} queryParameters The query parameters that have been retrieved via URL query parameters.
	     * @return {{ [key: string]: any }} Returns a dictionary with all parmeters.
	     */
	    private generateParameters(path, parameters, queryParameters);
	    /**
	     * Generates a URL href that can be used in links that should navigate to the route.
	     * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
	     * @return {string} Returns the href link that can be used in views to navigate to the route.
	     */
	    href(cultureOrAbsolute?: CultureInfo | boolean): string;
	    /**
	     * Navigates to the route.
	     * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
	     */
	    navigate(cultureOrAbsolute?: CultureInfo | boolean): void;
	}
	export = ActiveRoute;

}
declare module 'Navigation/NavigationConfiguration' {
	 class NavigationConfiguration {
	    /**
	     * Gets or sets the root path that overrides the default root path.
	     */
	    rootPath: string | null;
	    /**
	     * Gets or sets the start route that overrides the default start route.
	     */
	    startRoute: string | null;
	    /**
	     * Gets or sets a value that indicates whether the culture should be added to the URL of the routes.
	     */
	    addCultureToUris: boolean;
	}
	export = NavigationConfiguration;

}
declare module 'Navigation/NavigationService' {
	/// <reference path="../Typings/References.d.ts" />
	import ActiveRoute = require("Navigation/ActiveRoute");
	import NavigationConfiguration = require("Navigation/NavigationConfiguration");
	import Route = require("Navigation/Route"); class NavigationService {
	    /**
	     * Contains a value that determines whether push state is supported by the browser
	     */
	    private static isPushStateEnabled;
	    /**
	     * Contains a dictionary of the module ID and the name of the route. This is used to get the name from a module ID.
	     */
	    private static routeNames;
	    /**
	     * Contains all routes that have been added to the navigation service.
	     */
	    private static _routes;
	    /**
	     * Contains the shell that uses the navigation service.
	     */
	    private static _shell;
	    /**
	     * Contains a value that determines whether the navigation service is currently navigating.
	     */
	    private static _isNavigating;
	    /**
	     * Contains the route that is currently active, and a set of parameters of the route.
	     */
	    private static _activeRoute;
	    /**
	     * Contains the current configuration of the navigation service.
	     */
	    private static configuration;
	    /**
	     * Gets a value that determines whether the navigation service is currently navigating.
	     */
	    static readonly isNavigating: KnockoutComputed<boolean>;
	    /**
	     * Gets the route that is currently active, and a set of parameters of the route.
	     */
	    static readonly activeRoute: KnockoutComputed<ActiveRoute | null>;
	    /**
	     * Gets all routes that have been added to the navigation service.
	     */
	    static readonly routes: {
	        [name: string]: Route;
	    };
	    /**
	     * Gets the shell of the navigation service.
	     */
	    static readonly shell: any;
	    /**
	     * Configures the durandal system so that the view-model-view convention of naming files is used.
	     * @param {NavigationConfiguration} configuration The configuration that the navigation service should use.
	     */
	    static use(configuration: NavigationConfiguration): void;
	    /**
	     * Adds a new route to the navigation service.
	     * @param {string} name The name of the route (this will be used to generate the module ID that is loaded).
	     * @param {string} title The title of the route.
	     * @param {Array<string>} paths The paths that should map to this route. If no paths are provided, the route will catch all unknown paths.
	     */
	    static addRoute(name: string, title: string, ...paths: Array<string>): void;
	    /**
	     * Navigates back to the last route that has been active.
	     */
	    static navigateBack(): void;
	    /**
	     * Activates the navigation service, which should be called in the activate method of the shell view model.
	     * @param {any} shell The shell view model that is the root of all view models.
	     * @return {JQueryPromise<any>} Returns a promise that resolves as soon as the navigation service is activated.
	     */
	    static activate(shell: any): JQueryPromise<any>;
	    /**
	     * Scrolls to the top of the page.
	     */
	    static scrollToTop(): void;
	    /**
	     * Scrolls to an anchor of the page.
	     * @param {string} anchor The anchor to which the page is scrolled.
	     */
	    static scrollTo(anchor: string): void;
	    /**
	     * Checks whether the element with the provided anchor is in the current view.
	     * @param {string} anchor The anchor which is searched for.
	     * @return {boolean} Returns a value that determines whether the element with the provided anchor is in the current view.
	     */
	    static isInViewport(anchor: string): boolean;
	}
	export = NavigationService;

}
declare module 'Navigation/Route' {
	/// <reference path="../Typings/References.d.ts" />
	import CultureInfo = require("Globalization/CultureInfo"); class Route {
	    /**
	     * Initializes a new Route instance.
	     * @param {string} name The name of the route.
	     * @param {string} title The title of the route, which is displayed in the title bar of the browser.
	     * @param {Array<string>} paths All paths that match the route.
	     * @param {KnockoutComputed<boolean>} isActive A value that determines whether the route is currently active.
	     * @param {boolean} addCultureToUri A value that determines whether the culture should be added to the URL of the route.
	     */
	    constructor(name: string, title: string, paths: Array<string>, isActive: KnockoutComputed<boolean>, addCultureToUri: boolean);
	    /**
	     * Contains all paths that match the route.
	     */
	    private paths;
	    /**
	     * Contains the name of the route.
	     */
	    private _name;
	    /**
	     * Contains the title of the route, which is displayed in the title bar of the browser.
	     */
	    private _title;
	    /**
	     * Contains a value that determines whether the route is currently active.
	     */
	    private _isActive;
	    /**
	     * Contains a value that indicates whether the culture should be added to the URL of the route.
	     */
	    private _addCultureToUri;
	    /**
	     * Gets the name of the route.
	     */
	    readonly name: string;
	    /**
	     * Gets the title of the route, which is displayed in the title bar of the browser.
	     */
	    readonly title: string;
	    /**
	     * Gets a value that determines whether the route is currently active.
	     */
	    readonly isActive: KnockoutComputed<boolean>;
	    /**
	     * Gets a value that indicates whether the culture is added to the URL of the route.
	     */
	    readonly addCultureToUri: boolean;
	    /**
	     * Generates a dictionary of paths and their parameter names.
	     * @param {Array<string>} paths The list of paths.
	     * @return {{ [key: string]: Array<string> }} Returns a dictionary with a list of paths and their parameter names.
	     */
	    private generatePaths(paths);
	    /**
	     * Generates a URI which can be used to navigate to the route.
	     * @param {{ [key: string]: any }} parameters The parameters that are used to navigate to the route.
	     * @return {string} Returns the generated URI.
	     */
	    private generateUri(parameters);
	    /**
	     * Generates a URL href that can be used in links that should navigate to the route.
	     * @param {{ [key: string]: any; }|string} parameters If a string parameter is specified, it is used as ":id" parameter in the route. Providing a dictionary, all route parameters can be specified.
	     * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
	     * @return {string} Returns the href link that can be used in views to navigate to the route.
	     */
	    href(parameters?: {
	        [key: string]: any;
	    } | string, cultureOrAbsolute?: CultureInfo | boolean): string;
	    /**
	     * Navigates to the route.
	     * @param {{ [key: string]: string; }|string} parameters If a string parameter is specified, it is used as ":id" parameter in the route. Providing a dictionary, all route parameters can be specified.
	     * @param {CultureInfo|boolean} cultureOrAbsolute If a culture is provided, a link will be returned that can be used to change the culture of the application. If the value is a boolean, an absolute URI is returned.
	     */
	    navigate(parameters?: {
	        [key: string]: any;
	    } | string, cultureOrAbsolute?: CultureInfo | boolean): void;
	}
	export = Route;

}
