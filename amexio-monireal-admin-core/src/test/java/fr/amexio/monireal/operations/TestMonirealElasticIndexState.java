package fr.amexio.monireal.operations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import fr.amexio.monireal.testing.TestingService;
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
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.elasticsearch.api.ElasticSearchAdmin;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.elasticsearch.web.admin.ElasticSearchManager;
import org.nuxeo.runtime.RuntimeService;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@RunWith(FeaturesRunner.class)
@Features({ CoreFeature.class, AutomationFeature.class, RepositoryElasticSearchFeature.class })
@Deploy({ "fr.amexio.monireal.amexio-monireal-admin-core" })
public class TestMonirealElasticIndexState extends TestingService {
  private static final Log log = LogFactory.getLog(TestMonirealElasticIndexState.class);

  @Inject
  protected CoreSession session;

  @Inject
  AutomationService automationService;

  @Inject
  ElasticSearchAdmin esa;

  @Override
  public void isNuxeoStarted() {
    super.isNuxeoStarted();
  }

  @Override
  public void isComponentExist() {
    super.isComponentExist();
  }

  @Override
  public void isOperationContextAndAutomationServiceExist() {
    super.isOperationContextAndAutomationServiceExist();
  }

  @Test
  public void isElasticSearchConnected() throws IOException, OperationException {
    assertNotNull("ElasticSearchAdmin in not available.", esa);
  }

  @Test
  public void shouldReturnJSONBlob() throws OperationException, IOException {
    OperationContext context = new OperationContext(session);
    Blob doc = (Blob) automationService.run(context, MonirealElasticIndexStateOP.ID);

    BufferedReader reader = new BufferedReader(new InputStreamReader(doc.getStream()));
    String line;
    while ((line = reader.readLine()) != null) {
      log.debug(line);
    }

    assertNotNull("doc in not available.", doc);
    assertEquals("application/json", doc.getMimeType());
  }
}
