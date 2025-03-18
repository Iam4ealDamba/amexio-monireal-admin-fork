package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.elasticsearch.ElasticSearchChecker;
import org.nuxeo.elasticsearch.api.ElasticSearchAdmin;

import java.util.Optional;

/**
 * This request allows the optimization of all Elasticsearch indexes.
 */
@Operation(id = MonirealElasticIndexOptimiserOP.ID, category = MonirealConstants.MONIREAL, label = "ElasticSearch Index Optimiser", description = "This request allows the optimization of all Elasticsearch indexes.")
public class MonirealElasticIndexOptimiserOP {

  public static final String ID = MonirealConstants.MONIREAL + ".elasticIndexOptimiser";

  @Context
  protected OperationContext ctx;

  @Context
  protected ElasticSearchAdmin esa;


  public JSONObject optimizeIndexes() {
    JSONObject json = new JSONObject();

    try {
      esa.optimize();

      json.put("status", "success");
      json.put("msg", "the request was successfully executed");
      return json;
    } catch (Exception e) {
      e.printStackTrace();

      json.put("status", "error");
      json.put("msg", e.getMessage());
      return null;
    }
  }

  @OperationMethod
  public Blob run() {
    JSONObject result = optimizeIndexes();

    // verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    if (Optional.of(result).isPresent()) {
      // Return the result of the result of the executed function
      return new JSONBlob(result.toString());
    } else {
      return null;
    }
  }
}
