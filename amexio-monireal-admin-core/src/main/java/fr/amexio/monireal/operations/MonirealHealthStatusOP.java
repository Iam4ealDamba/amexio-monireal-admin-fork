package fr.amexio.monireal.operations;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.nuxeo.ecm.core.management.api.ProbeInfo;
import org.nuxeo.ecm.core.management.api.ProbeManager;
import org.nuxeo.ecm.core.management.probes.ProbeManagerImpl;
import org.nuxeo.runtime.api.Framework;

import java.io.IOException;
import java.net.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

/**
 * Get all the health status from Nuxeo.
 */
@Operation(id = MonirealHealthStatusOP.ID, category = MonirealConstants.MONIREAL, label = "Health Status", description = "Start probes opération and return the result.")
public class MonirealHealthStatusOP {

  public static final String ID = MonirealConstants.MONIREAL + ".getHealthStatus";

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @Context
  protected ProbeManager manager;

  /**
   * Fetch the probe list
   * @return List of ProbeInfo, and return null if an error is caught.
   */
  protected List<ProbeInfo> getAllProbes() {
    try {
      return new ArrayList<>(manager.getAllProbeInfos());
    } catch (Exception e) {
      e.fillInStackTrace();
      return null;
    }
  }

  /**
   * Checks the status of a given probe.
   *
   * @param probe The probe to be checked.
   * @return The updated ProbeInfo after executing the probe, or null if an error occurs.
   */
  protected ProbeInfo checkProbe(ProbeInfo probe) {
    try {
      // Run the probe using the ProbeManager and return the result
      return manager.runProbe(probe);
    } catch (Exception e) {
      // Log the stack trace for debugging purposes and return null
      e.fillInStackTrace();
      return null;
    }
  }

  @OperationMethod
  public Blob run() throws IOException, URISyntaxException, InterruptedException {
    // Verify if the user has right access
    AuthAccessUtils.checkAccess(ctx);

    List<ProbeInfo> probes = getAllProbes();
    List<ProbeInfo> result = new ArrayList<>();

    for (ProbeInfo probe : probes) {
      result.add(checkProbe(probe));
    }

    JSONObject json = new JSONObject();
    json.put("probes", result);
    return new JSONBlob(json.toString());

  }

}
