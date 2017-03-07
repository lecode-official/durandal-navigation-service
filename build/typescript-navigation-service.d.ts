
/// <reference path="../../bower_components/DefinitelyTyped/jquery/index.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/durandal/index.d.ts" />
/// <reference path="../../bower_components/typescript-globalization/build/typescript-globalization.d.ts" />
declare module 'Navigation/ActiveRoute' {
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
