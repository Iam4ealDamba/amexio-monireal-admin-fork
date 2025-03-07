package fr.amexio.monireal.operations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import javax.inject.Inject;

import com.google.gson.JsonObject;
import com.rabbitmq.tools.json.JSONReader;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bson.json.JsonReader;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@RunWith(FeaturesRunner.class)
@Deploy({ "fr.amexio.monireal.amexio-monireal-admin-core" })
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Features({ CoreFeature.class, AutomationFeature.class })
public class TestMonirealJVMStatusOP {
  private static final Log log = LogFactory.getLog(TestMonirealJVMStatusOP.class);

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Test
  public void shouldReturnJSONBlob() throws OperationException, IOException {
    OperationContext ctx = new OperationContext(session);
    Blob doc = (Blob) automationService.run(ctx, MonirealJVMStatusOP.ID);

    BufferedReader reader = new BufferedReader(new InputStreamReader(doc.getStream()));
    String line;
    while ((line = reader.readLine()) != null) {

      log.info(line);
    }

    assertNotNull("doc in not available.", doc);
    assertEquals("application/json", doc.getMimeType());
  }
}
