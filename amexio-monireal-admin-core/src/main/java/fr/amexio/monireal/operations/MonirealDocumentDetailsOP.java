package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.BlobList;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.blobholder.BlobHolder;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.api.model.impl.ListProperty;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * Fetch details from a document with a given ID.
 */
@Operation(id = MonirealDocumentDetailsOP.ID, category = MonirealConstants.MONIREAL, label = "Document Details", description = "Fetch details from a document with a given ID.")
public class MonirealDocumentDetailsOP {
  /**
   * Request Identifier
   */
  public static final String ID = MonirealConstants.MONIREAL + ".documentDetails";

  @Context
  protected CoreSession session;

  @Param(name = "docID", required = true, values = StringUtils.EMPTY, description = "The document ID")
  protected String docID;

  @OperationMethod
  public Blob run() {
    JSONObject result = new JSONObject();
    String query = MonirealConstants.DEFAULT_NXQL_QUERY + " WHERE ecm:uuid = '" + docID + "'";
    DocumentModelList list = session.query(query);

    if (docID.length() > 0) {
      if (!list.isEmpty()) {
        DocumentModel doc = list.get(0);
        GregorianCalendar createdCalendar = (GregorianCalendar) doc.getPropertyValue("dc:created");
        GregorianCalendar modifiedCalendar = (GregorianCalendar) doc.getPropertyValue("dc:modified");

        // Insert into obj object
        JSONObject obj = new JSONObject();
        obj.put("id", doc.getId());
        obj.put("type", doc.getType());
        obj.put("title", doc.getTitle());
        obj.put("path", doc.getPathAsString());
        obj.put("state", doc.getCurrentLifeCycleState());
        obj.put("repository", doc.getRepositoryName());
        obj.put("created", createdCalendar.getTimeInMillis());
        obj.put("modified", modifiedCalendar.getTimeInMillis());
        obj.put("creator", doc.getPropertyValue("dc:creator"));
        obj.put("contributors", doc.getPropertyValue("dc:contributors"));

        // Insert into result object
        result.put("status", "success");
        result.put("msg", "Request was successfully executed.");
        result.put("data", obj);
      } else {
        result.put("status", "error");
        result.put("msg", "docID not found");
      }
    } else {
      result.put("status", "error");
      result.put("msg", "docID is required");
    }

    return new JSONBlob(result.toString());
  }
}
