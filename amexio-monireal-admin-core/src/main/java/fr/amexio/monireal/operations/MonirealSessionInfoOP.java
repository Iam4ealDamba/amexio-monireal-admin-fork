package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.platform.web.common.session.NuxeoHttpSessionMonitor;

/**
 * Get all sessions and their infos from Nuxeo.
 */
@Operation(id = MonirealSessionInfoOP.ID, category = MonirealConstants.MONIREAL, label = "Session Information", description = "Get all the sessions and their information from Nuxeo.")
public class MonirealSessionInfoOP {

  public static final String ID = MonirealConstants.MONIREAL + ".getSessionsInfo";

  @Context
  protected CoreSession session;

  @OperationMethod
  public Blob run() {
    JSONObject json = new JSONObject();
    json.put("totalRequests", NuxeoHttpSessionMonitor.instance().getGlobalRequestCounter());
    json.put("activeSessionsCount", NuxeoHttpSessionMonitor.instance().getSortedSessions().size());
    json.put("activeSessions", NuxeoHttpSessionMonitor.instance().getSortedSessions());

    return new JSONBlob(json.toString());
  }
}
