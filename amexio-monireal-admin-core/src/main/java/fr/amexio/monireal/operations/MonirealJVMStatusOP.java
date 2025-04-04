package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;
import fr.amexio.monireal.utils.AuthAccessUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;

/**
 * Retrieve JVM information.
 */
@Operation(id = MonirealJVMStatusOP.ID, category = MonirealConstants.MONIREAL, label = "JVM Status", description = "Retrieve JVM information.")
public class MonirealJVMStatusOP {

  public static final String ID = MonirealConstants.MONIREAL + ".getJVMStatus";

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public Blob run() {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    // Initialize values
    JSONObject json = new JSONObject();
    Runtime rt = Runtime.getRuntime();
    long maxMemory = rt.maxMemory();
    long totalMemory = rt.totalMemory();
    long freeMemory = rt.freeMemory();
    long usedMemory = totalMemory - freeMemory;

    // Insert JVM Runtime values inside json object
    json.put("maxMemory", maxMemory);
    json.put("totalMemory", totalMemory);
    json.put("freeMemory", freeMemory);
    json.put("usedMemory", usedMemory);
    json.put("javaVersion", System.getProperty("java.version"));

    // Create a JSON blob
    JSONBlob blob = new JSONBlob(json.toString());

    return blob;
  }
}
