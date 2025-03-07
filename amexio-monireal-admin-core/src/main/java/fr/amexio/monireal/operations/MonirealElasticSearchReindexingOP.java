package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.elasticsearch.api.ElasticSearchAdmin;
import org.nuxeo.elasticsearch.api.ElasticSearchIndexing;
import org.nuxeo.elasticsearch.commands.IndexingCommand;

import java.util.Arrays;
import java.util.List;

/**
 * Execute the requested ElasticSearch re-indexing
 */
@Operation(id = MonirealElasticSearchReindexingOP.ID, category = MonirealConstants.MONIREAL, label = "ElasticSearch Re-Indexing", description = "Execute the requested ElasticSearch re-indexing")
public class MonirealElasticSearchReindexingOP {

  // -----------------------------
  // Variables
  // -----------------------------
  public static List<String> repositoryNames;
  public static String repositoryName;

  // -----------------------------
  // Constants
  // -----------------------------
  private static final Log LOG = LogFactory.getLog(MonirealElasticSearchReindexingOP.class);
  public static final String ID = MonirealConstants.MONIREAL + ".elasticSearchReindexing";
  private static final String JSON_DELETE_CMD = "{\"id\":\"IndexingCommand-reindex\",\"type\":\"DELETE\",\"docId\":\"%s\",\"repo\":\"%s\",\"recurse\":true,\"sync\":true}";

  // -----------------------------
  // Context
  // -----------------------------
  @Context
  protected OperationContext ctx;

  @Context
  protected ElasticSearchAdmin esa;

  @Context
  protected ElasticSearchIndexing esi;

  // -----------------------------
  // Params
  // -----------------------------
  @Param(name = "type", description = "The type to reindex (Document, Query)", values = {"Document", "Query"})
  protected String type;

  @Param(name = "documentUID", required = false, description = "The document uid to reindex", values = "")
  protected String documentUID;

  @Param(name = "query", required = false, description = "The query to reindex (eg: SELECT * FROM Document)", values = {MonirealConstants.DEFAULT_NXQL_QUERY})
  protected String query = MonirealConstants.DEFAULT_NXQL_QUERY;

  // -----------------------------
  // Methods
  // -----------------------------

  public List<String> getAllRepositories() {
    if (repositoryNames == null) {
      repositoryNames = esa.getRepositoryNames();
    }
    return repositoryNames;
  }

  public String getOneRepository() {
    try {
      if (repositoryName == null) {
        List<String> repositoryNames = getAllRepositories();
        if (!repositoryNames.isEmpty()) {
          repositoryName = repositoryNames.get(0);
        }
      }
      return repositoryName;
    } catch (Exception e) {
      return null;
    }
  }

  public JSONObject executeMethod() {
    switch (type) {
      case "Document":
        return handleDocumentQuery();
      case "Query":
        return handleNXQLQuery();
      default:
        return null;
    }
  }

  public JSONObject handleDocumentQuery() {
    String repositoryName = getOneRepository();
    JSONObject result = new JSONObject();
    try (CloseableCoreSession session = CoreInstance.openCoreSessionSystem(repositoryName)) {
      LOG.warn(String.format("Try to remove %s and its children from %s repository index", documentUID,
          repositoryName));
      String jsonCmd = String.format(JSON_DELETE_CMD, repositoryName, repositoryName);
      IndexingCommand rmCmd = IndexingCommand.fromJSON(jsonCmd);
      esi.indexNonRecursive(rmCmd);

      DocumentRef ref = new IdRef(repositoryName);
      if (session.exists(ref)) {
        DocumentModel doc = session.getDocument(ref);
        LOG.warn(String.format("Re-indexing document: %s and its children on repository: %s", doc,
            repositoryName));
        IndexingCommand cmd = new IndexingCommand(doc, IndexingCommand.Type.INSERT, false, true);
        esi.runIndexingWorker(Arrays.asList(cmd));

        // Result
        result.put("status", "ok");
        result.put("msg", "Re-indexing done");
      }
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);

      // Result
      result.put("status", "error");
      result.put("msg", e.getMessage());
    }
    return result;
  }

  public JSONObject handleNXQLQuery() {
    // Retrieve the repository name for the query
    String repoName = getOneRepository();
    JSONObject result = new JSONObject();
    LOG.warn(String.format("Re-indexing from a NXQL query: %s on repository: %s", query, repoName));
    // Execute the query
    try {
      esi.runReindexingWorker(repoName, query);

      // Result
      result.put("status", "ok");
      result.put("msg", "Re-indexing done");
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);

      // Result
      result.put("status", "error");
      result.put("msg", e.getMessage());
    }
    return result;
  }

  // -----------------------------
  // Code Run
  // -----------------------------

  @OperationMethod
  public Blob run() {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    // Execute the method
    JSONObject result = executeMethod();
    return new JSONBlob(result.toString());
  }
}
