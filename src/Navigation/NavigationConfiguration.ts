
/**
 * Represents the configuration of the navigation service.
 */
class NavigationConfiguration {

    // #region Public Properties

    /**
     * Gets or sets the root path that overrides the default root path.
     */
    public rootPath: string;

    /**
     * Gets or sets the start route that overrides the default start route.
     */
    public startRoute: string;

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = NavigationConfiguration;