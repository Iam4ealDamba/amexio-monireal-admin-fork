package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.elasticsearch.api.ElasticSearchAdmin;

/**
 * This request flushes all the ElasticSearch indexes
 */
@Operation(id = MonirealElasticIndexesFlushOP.ID, category = MonirealConstants.MONIREAL, label = "Elastic Indexes Flush", description = "This request flushes all the ElasticSearch indexes")
public class MonirealElasticIndexesFlushOP {

  public static final String ID = MonirealConstants.MONIREAL + ".elasticIndexesFlush";

  @Context
  protected ElasticSearchAdmin esa;

  @Context
  protected OperationContext ctx;

  public JSONObject flushIndexes() {
    try {
      esa.flush();
      return new JSONObject().put("status", "success").put("msg", "the request was successfully executed");
    } catch (Exception e) {
      e.fillInStackTrace();
      return new JSONObject().put("status", "error").put("msg", e.getMessage());
    }
  }

  @OperationMethod
  public Blob run() {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    JSONObject json = flushIndexes();
    return new JSONBlob(json.toString());
  }
}
