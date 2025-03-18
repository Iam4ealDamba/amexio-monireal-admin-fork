package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.apache.commons.lang3.ArrayUtils;
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
import org.nuxeo.ecm.platform.routing.api.DocumentRoutingService;

import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.*;

/**
 * This operation delegate one or multiple task to an authorize user.
 */
@Operation(id = MonirealTaskDelegationOP.ID, category = MonirealConstants.MONIREAL, label = "Task Delegation", description = "This operation delegate one or multiple task to an authorize user.")
public class MonirealTaskDelegationOP {

  public static final String ID = MonirealConstants.MONIREAL + ".taskDelegation";

  protected static final Log log = LogFactory.getLog(MonirealTaskDelegationOP.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @Context
  protected DocumentRoutingService routingService;

  @Param(name = "taskID", required = true, description = "The task ID string/array")
  protected String taskID;

  @Param(name = "reviewerID", required = true, description = "The reviewer ID string/array")
  protected String reviewerID;

  @OperationMethod
  public Blob run() {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    JSONObject json = new JSONObject();
    DocumentModel workflowInstance;
    List<DocumentModel> listTask = new ArrayList<>();
    List<String> listUser = new ArrayList<>();
    List<String> tempList = new ArrayList<>();

    try {
      // Check if taskID is multiple
      if (taskID.contains(";")) {
        tempList = new ArrayList<>(List.of(taskID.split(";")));

        for (String id : tempList) {
          workflowInstance = session.getDocument(new IdRef(id));
          listTask.add(workflowInstance);
        }
      } else {
        workflowInstance = session.getDocument(new IdRef(taskID));
        listTask.add(workflowInstance);
      }

      //  Check if reviewerID is multiple
      if (reviewerID.contains(";")) {
        tempList = new ArrayList<>(List.of(reviewerID.split(";")));
        listUser = tempList;
      } else {
        listUser.add(reviewerID);
      }

      // Fill delegation task
      for (DocumentModel task : listTask) {
        List<String> delegatedActors = (List<String>) task.getPropertyValue("nt:delegatedActors");

        // Check if delegatedActors is empty ou not
        if (!delegatedActors.isEmpty()) {
          delegatedActors.addAll(listUser);
          for (String user : delegatedActors) {
            delegatedActors.removeAll(Collections.singleton(user));
          }

          task.setPropertyValue("nt:delegatedActors", (Serializable) delegatedActors);
          session.saveDocument(task);
        } else {
          task.setPropertyValue("nt:delegatedActors", (Serializable) listUser);
          session.saveDocument(task);
        }
      }

      // Insert to 'json' return object
      json.put("status", "success");
      json.put("msg", "Task was successfully delegated");
    } catch (Exception e) {
      json.put("status", "error");
      json.put("msg", e.getMessage());
      log.error(e.getMessage(), e);

      return new JSONBlob(json.toString());
    }

    return new JSONBlob(json.toString());
  }
}
