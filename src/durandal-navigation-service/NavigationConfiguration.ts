
///<amd-module name='durandal-navigation-service/NavigationConfiguration'/>

/**
 * Represents the configuration of the navigation service.
 */
class NavigationConfiguration {

    // #region Public Properties

    /**
     * Gets or sets the root path that overrides the default root path.
     */
    public rootPath: string | null;

    /**
     * Gets or sets the start route that overrides the default start route.
     */
    public startRoute: string | null;

    /**
     * Gets or sets a value that indicates whether the culture should be added to the URL of the routes.
     */
    public addCultureToUris: boolean;

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = NavigationConfiguration;