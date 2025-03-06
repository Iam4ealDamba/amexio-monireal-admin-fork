package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;

/**
 *
 */
@Operation(id = MonirealTaskDetailsOP.ID, category = MonirealConstants.MONIREAL, label = "Task Detail", description = "Describe here what your operation does.")
public class MonirealTaskDetailsOP {

  public static final String ID = MonirealConstants.MONIREAL + ".TaskDetail";

  @Context
  protected CoreSession session;

  @Param(name = "taskID", required = false)
  protected String taskID;

  @OperationMethod
  public Blob run() {
    String query = MonirealConstants.DEFAULT_NXQL_TASK_DETAIL + " '" + taskID + "'";
    JSONObject json = new JSONObject();

    try {
      DocumentModelList tasks = session.query(query);

      if (!tasks.isEmpty()) {
        DocumentModel task = tasks.get(0);
        GregorianCalendar modifiedCalendar = (GregorianCalendar) task.getPropertyValue("dc:modified");
        GregorianCalendar dueDateCalendar = (GregorianCalendar) task.getPropertyValue("nt:dueDate");

        // Copy the task to 'obj' json object
        JSONObject obj = new JSONObject();
        obj.put("id", task.getId());
        obj.put("name", task.getTitle());
        obj.put("state", task.getCurrentLifeCycleState());
        obj.put("directive", task.getPropertyValue("nt:directive"));
        obj.put("creator", task.getPropertyValue("dc:creator"));
        obj.put("contributors", task.getPropertyValue("dc:contributors"));
        obj.put("modified", modifiedCalendar.getTimeInMillis());
        obj.put("dueDate", dueDateCalendar.getTimeInMillis());
        obj.put("path", task.getPathAsString());
        obj.put("repository", task.getRepositoryName());
        obj.put("type", task.getDocumentType().toString());
        obj.put("relatedDocuments", task.getPropertyValue("nt:targetDocumentsIds"));
        obj.put("taskComments",  task.getPropertyValue("nt:taskComments"));

        // Insert to 'json' return object
        json.put("status", "success");
        json.put("msg", "Task was successfully retrieved");
        json.put("data", obj);
      } else {
        json.put("status", "error");
        json.put("msg", "No task found");
      }
    } catch (Exception e) {
      json.put("status", "error");
      json.put("msg", e.getMessage());
    }

    return new JSONBlob(json.toString());
  }
}
