package fr.amexio.monireal.constants;

public class MonirealConstants {
    public static final String MONIREAL = "Monireal";
    public static final String DEFAULT_NXQL_QUERY = "SELECT * FROM Document";
    public static final String DEFAULT_NXQL_TASK_LIST = "SELECT * FROM RoutingTask WHERE ecm:currentLifeCycleState = 'opened'";
    public static final String DEFAULT_NXQL_TASK_DETAIL = "SELECT * FROM RoutingTask WHERE ecm:uuid =";
}
