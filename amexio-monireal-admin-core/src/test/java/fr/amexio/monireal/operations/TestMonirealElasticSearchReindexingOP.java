package fr.amexio.monireal.operations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

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
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.elasticsearch.api.ElasticSearchAdmin;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({ CoreFeature.class, AutomationFeature.class, RepositoryElasticSearchFeature.class })
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
  @Deploy("fr.amexio.monireal.amexio-monireal-admin-core:OSGI-INF/monireal-op-elastic-reindexing-contrib.xml")
public class TestMonirealElasticSearchReindexingOP extends TestingService {
  private static final Log log = LogFactory.getLog(TestMonirealElasticSearchReindexingOP.class);

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Inject
  protected ElasticSearchAdmin esa;

  @Test
  public void shouldReturnJSONBlob() throws OperationException, IOException {
    OperationContext context = new OperationContext(session);
    Map<String, Object> params = new HashMap<>();
    params.put("type", "Query");
    params.put("query", "SELECT * FROM Document");

    Blob doc = (Blob) automationService.run(context, MonirealElasticSearchReindexingOP.ID, params);

    BufferedReader reader = new BufferedReader(new InputStreamReader(doc.getStream()));
    String line;
    while ((line = reader.readLine()) != null) {
      log.info(line);
    }

    assertNotNull("doc in not available.", doc);
    assertEquals("application/json", doc.getMimeType());
  }
}
