package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.jboss.seam.ScopeType;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.platform.audit.api.AuditReader;
import org.nuxeo.ecm.platform.audit.api.LogEntry;
import org.nuxeo.runtime.api.Framework;
import org.jboss.seam.annotations.Factory;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Get all the events by sessions from Nuxeo.
 */
@Operation(id = MonirealSessionEventsOP.ID, category = MonirealConstants.MONIREAL, label = "Session Evenements", description = "Get all the events by sessions from Nuxeo.")
public class MonirealSessionEventsOP {

  public static final String ID = MonirealConstants.MONIREAL + ".getSessionEvents";

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  // Audit Variables
  protected String selectedAuditTimeRange;
  protected String selectedAuditCategory;

  // Total Events
  protected int total = 0;

  @Param(name = "current_page", required = false, description = "The current page to display", values = "1")
  protected int currentPage = 1;

  @Param(name = "per_page", required = false, description = "The number of items per page", values = {"10", "20", "50", "100"})
  protected int perPage = 10;

  @Param(name = "dateRange", required = false, values = {"all", "1d", "1w", "1m",
      "1y"}, description = "The date range to display")
  protected String dateRange = "all";

  // *********************************
  // Audit Management

  /**
   * Get selected audit category
   */
  public String getSelectedAuditCategory() {
    if (selectedAuditCategory == null) {
      selectedAuditCategory = "all";
    }
    return selectedAuditCategory;
  }

  /**
   * Get selected audit time range
   */
  public String getSelectedAuditTimeRange() {
    if (selectedAuditTimeRange == null) {
      selectedAuditTimeRange = "all";
    }
    return selectedAuditTimeRange;
  }

  /**
   * Get session events
   */
  public List<LogEntry> getSessionEvents() {

    AuditReader reader = Framework.getService(AuditReader.class);

    String limit_date = getSelectedAuditTimeRange();
    String[] categories = {getSelectedAuditCategory()};
    if (getSelectedAuditCategory().equals("all")) {
      categories = new String[0];
    }

    List<LogEntry> loginInfo = reader.queryLogs(categories, limit_date).stream().sorted((o1, o2) -> (int) o2.getId() - (int) o1.getId()).skip(perPage * (currentPage - 1)).limit(perPage).collect(Collectors.toList());
    return loginInfo;
  }

  /**
   * Get session events length
   *
   * @return
   */
  public Integer getSessionEventsLength() {

    AuditReader reader = Framework.getService(AuditReader.class);
    String limit_date = getSelectedAuditTimeRange();

    return reader.queryLogs(new String[0], limit_date).size();
  }

  @OperationMethod
  public Blob run() {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    try {
      List<LogEntry> loginInfo = getSessionEvents();
      JSONObject json = new JSONObject();
      json.put("perPage", perPage);
      json.put("currentPage", currentPage);
      json.put("session_events", loginInfo);
      json.put("total", getSessionEventsLength());

      return new JSONBlob(json.toString());
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

}
