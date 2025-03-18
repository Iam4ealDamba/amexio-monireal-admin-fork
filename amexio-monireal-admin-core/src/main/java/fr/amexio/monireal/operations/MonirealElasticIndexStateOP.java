package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jboss.seam.annotations.In;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.elasticsearch.api.ElasticSearchAdmin;
import org.nuxeo.elasticsearch.web.admin.ElasticSearchManager;
import org.nuxeo.runtime.api.Framework;

import javax.inject.Inject;

/**
 * Retrieve ElasticSearch indexes state.
 */
@Operation(id = MonirealElasticIndexStateOP.ID, category = MonirealConstants.MONIREAL, label = "ElasticSearch Index State", description = "Retrieve ElasticSearch indexes state.")
public class MonirealElasticIndexStateOP {
  public static final String ID = MonirealConstants.MONIREAL + ".getElasticIndexState";

  private static Log log = LogFactory.getLog(MonirealElasticIndexStateOP.class);

  @Context
  protected OperationContext ctx;

  @Context
  protected ElasticSearchAdmin esa;

  public Integer getTotalCommandProcessed() {
    try {
      return esa.getTotalCommandProcessed();
    } catch (Exception e) {
      log.error("Error while getting total command processed.", e);
      return 0;
    }
  }

  public JSONObject getNodesInfo() {
    JSONObject json = new JSONObject();
    ElasticSearchManager esm = new ElasticSearchManager();

    json.put("pendingCount", esa.getPendingWorkerCount());
    json.put("runningCount", esa.getRunningWorkerCount());
    json.put("totalCommand", getTotalCommandProcessed());
    System.out.println();
    return json;
  }

  @OperationMethod
  public Blob run() throws Exception {
    AuthAccessUtils.checkAccess(ctx);
    // Retrieve elasticsearch indexes state as json

    JSONObject json = getNodesInfo();
    return new JSONBlob(json.toString());
  }
}
