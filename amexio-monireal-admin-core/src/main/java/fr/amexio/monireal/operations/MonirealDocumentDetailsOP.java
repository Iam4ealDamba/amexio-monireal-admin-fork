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

  public static final String ID = MonirealConstants.MONIREAL + ".documentDetails";

  @Context
  protected CoreSession session;

  @Param(name = "docID", required = true, values = StringUtils.EMPTY)
  protected String docID;

  @OperationMethod
  public Blob run() {
    JSONObject json = new JSONObject();
    String query = MonirealConstants.DEFAULT_NXQL_QUERY + " WHERE ecm:uuid = '" + docID + "'";
    DocumentModelList list = session.query(query);

    if (docID.length() > 0) {
      if (!list.isEmpty()) {
        DocumentModel doc = list.get(0);
        GregorianCalendar createdCalendar = (GregorianCalendar) doc.getPropertyValue("dc:created");
        GregorianCalendar modifiedCalendar = (GregorianCalendar) doc.getPropertyValue("dc:modified");

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
        map.put("contributors", doc.getPropertyValue("dc:contributors"));

        // Insert into json object
        json.put("status", "success");
        json.put("msg", "Request was successfully executed.");
        json.put("data", map);
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
