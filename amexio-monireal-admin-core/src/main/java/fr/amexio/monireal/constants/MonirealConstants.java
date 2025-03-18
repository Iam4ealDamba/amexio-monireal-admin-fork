package fr.amexio.monireal.constants;

/**
 * All AmeXio Monireal Admin constants varables.
 */
public class MonirealConstants {
    /**
     * Category name
     */
    public static final String MONIREAL = "Monireal";
    /**
     * Default query for NXQL
     */
    public static final String DEFAULT_NXQL_QUERY = "SELECT * FROM Document";
    /**
     * Default query for fetching open tasks
     */
    public static final String DEFAULT_NXQL_TASK_LIST = "SELECT * FROM RoutingTask WHERE ecm:currentLifeCycleState = 'opened'";
    /**
     * Default query for fetching task detail
     */
    public static final String DEFAULT_NXQL_TASK_DETAIL = "SELECT * FROM RoutingTask WHERE ecm:uuid = ";
}
