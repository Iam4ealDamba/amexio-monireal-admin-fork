package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.platform.task.TaskService;

import java.util.*;

/**
 * Get all the tasks from the application.
 */
@Operation(id = MonirealTaskListOP.ID, category = MonirealConstants.MONIREAL, label = "Task List", description = "Get all the tasks from the application.")

public class MonirealTaskListOP {

  public static final String ID = MonirealConstants.MONIREAL + ".getAllTasks";

  @Context
  protected CoreSession session;

  @Context
  protected TaskService taskService;

  @OperationMethod
  public Blob run() {
    String query = MonirealConstants.DEFAULT_NXQL_TASK_LIST;
    DocumentModelList list = session.query(query);
    List<JSONObject> results = new ArrayList<>();
    JSONObject json = new JSONObject();

    for (DocumentModel doc : list) {
      GregorianCalendar modifiedCalendar = (GregorianCalendar) doc.getPropertyValue("dc:modified");
      GregorianCalendar dueDateCalendar = (GregorianCalendar) doc.getPropertyValue("nt:dueDate");

      JSONObject map = new JSONObject();
      map.put("id", doc.getId());
      map.put("name", doc.getTitle());
      map.put("state", doc.getCurrentLifeCycleState());
      map.put("directive", doc.getPropertyValue("nt:directive"));
      map.put("creator", doc.getPropertyValue("dc:creator"));
      map.put("modified", modifiedCalendar.getTimeInMillis());
      map.put("dueDate", dueDateCalendar.getTimeInMillis());
      map.put("path", doc.getPathAsString());
      map.put("repository", doc.getRepositoryName());
      map.put("type", doc.getDocumentType().toString());

      results.add(map);
    }

    // Insert into json object
    json.put("tasks", results);
    return new JSONBlob(json.toString());
  }
}
