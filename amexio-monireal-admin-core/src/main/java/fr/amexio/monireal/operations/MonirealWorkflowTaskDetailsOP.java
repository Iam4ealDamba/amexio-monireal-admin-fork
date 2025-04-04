package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;

import java.util.GregorianCalendar;

/**
 * Fetch details from a task with a given ID.
 */
@Operation(id = MonirealWorkflowTaskDetailsOP.ID, category = MonirealConstants.MONIREAL, label = "WorkflowTaskDetails", description = "Fetch details from a task with a given ID.")
public class MonirealWorkflowTaskDetailsOP {

  public static final String ID = MonirealConstants.MONIREAL + ".workflowTaskDetails";

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @Param(name = "docID", required = true, values = StringUtils.EMPTY, description = "The document ID")
  protected String docID;

  @OperationMethod
  public Blob run() {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    JSONObject json = new JSONObject();
    String query = MonirealConstants.DEFAULT_NXQL_TASK_DETAIL + "'" + docID + "'";
    DocumentModelList list = session.query(query);

    if (docID.length() > 0) {
      if (!list.isEmpty()) {
        DocumentModel doc = list.get(0);
        GregorianCalendar createdCalendar = (GregorianCalendar) doc.getPropertyValue("dc:created");
        GregorianCalendar modifiedCalendar = (GregorianCalendar) doc.getPropertyValue("dc:modified");

        if (!doc.getType().equals("RoutingTask")) {
          json.put("status", "error");
          json.put("msg", "document not typeof 'RoutingTask'");
        } else {
          JSONObject map = new JSONObject();
          map.put("id", doc.getId());
          map.put("type", doc.getType());
          map.put("title", doc.getTitle());
          map.put("path", doc.getPathAsString());
          map.put("state", doc.getCurrentLifeCycleState());
          map.put("repository", doc.getRepositoryName());
          map.put("created", createdCalendar.getTimeInMillis());
          map.put("modified", modifiedCalendar.getTimeInMillis());
          map.put("creator", doc.getPropertyValue("dc:creator"));
          map.put("delegatedActors", doc.getPropertyValue("nt:delegatedActors"));
          map.put("taskComments", doc.getPropertyValue("nt:taskComments"));

          // Insert into json object
          json.put("status", "success");
          json.put("msg", "Request was successfully executed.");
          json.put("data", map);
        }
      } else {
        json.put("status", "error");
        json.put("msg", "docID not found");
      }
    } else {
      json.put("status", "error");
      json.put("msg", "docID is required");
    }

    return new JSONBlob(json.toString());
  }
}
