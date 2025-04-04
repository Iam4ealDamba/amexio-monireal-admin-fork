package fr.amexio.monireal.operations;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

import static org.junit.Assert.*;

@RunWith(FeaturesRunner.class)
@Features(AutomationFeature.class)
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy("fr.amexio.monireal.amexio-monireal-admin-core")
public class TestMonirealElasticAudit {
  private static final Log log = LogFactory.getLog(TestMonirealElasticIndexState.class);

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Test
  public void shouldCallTheOperation() throws OperationException, IOException {
    OperationContext ctx = new OperationContext(session);
    Blob doc = (Blob) automationService.run(ctx, MonirealElasticAudit.ID);

    BufferedReader reader = new BufferedReader(new InputStreamReader(doc.getStream()));
    String line;
    while ((line = reader.readLine()) != null) {

      log.info(line);
    }

    assertNotNull("doc in not available.", doc);
    assertEquals("application/json", doc.getMimeType());
  }
}
