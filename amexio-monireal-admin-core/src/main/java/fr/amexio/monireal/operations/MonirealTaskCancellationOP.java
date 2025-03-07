package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.platform.routing.api.DocumentRoute;
import org.nuxeo.ecm.platform.routing.api.DocumentRoutingService;
import org.nuxeo.ecm.platform.routing.core.api.DocumentRoutingEngineService;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * This function proceed to the deletion of a task.
 */
@Operation(id = MonirealTaskCancellationOP.ID, category = MonirealConstants.MONIREAL, label = "Task Cancellation", description = "This function proceed to the cancellation of a task.")
public class MonirealTaskCancellationOP {

  public static final String ID = MonirealConstants.MONIREAL + ".taskCancellation";

  @Context
  protected CoreSession session;

  @Context
  protected DocumentRoutingService routingService;

  @Param(name = "taskID", required = true)
  protected String taskID;

  @OperationMethod
  public Blob run() {
    JSONObject json = new JSONObject();
    DocumentModel workflowInstance;
    List<String> list = new ArrayList<>();

    try {
      if (taskID.contains(";")) {
        list = new ArrayList<>(List.of(taskID.split(";")));

        for (String id : list) {
          workflowInstance = session.getDocument(new IdRef(id));
          routingService.cancelTask(session, workflowInstance.getId());
        }
      } else {
        workflowInstance = session.getDocument(new IdRef(taskID));
        routingService.cancelTask(session, workflowInstance.getId());
      }

      // Insert to 'json' return object
      json.put("status", "success");
      json.put("msg", "Task was successfully canceled");
    }
    catch (DocumentNotFoundException e) {
      json.put("status", "error");
      json.put("msg", e.getMessage());
      return new JSONBlob(json.toString());
    }

    return new JSONBlob(json.toString());
  }
}
