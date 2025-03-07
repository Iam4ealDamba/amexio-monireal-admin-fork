package fr.amexio.monireal.testing;

import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.runtime.RuntimeService;
import org.nuxeo.runtime.api.Framework;

import javax.inject.Inject;

import static org.junit.Assert.assertNotNull;

public class TestingService {

  @Inject
  private CoreSession coreSession;

  @Test
  public void isNuxeoStarted() {
    assertNotNull("Runtime in not available.", Framework.getRuntime());
  }

  @Test
  public void isComponentExist() {
    RuntimeService runtime = Framework.getRuntime();
    String componentName = "fr.amexio.monireal.operations.elastic-index-state-op";
    runtime.getComponent(componentName);

    assertNotNull("Component in not available.", runtime.getComponent(componentName));
  }

  @Test
  public void isOperationContextAndAutomationServiceExist() {
    OperationContext context = new OperationContext(coreSession);
    AutomationService automationService = Framework.getService(AutomationService.class);

    assertNotNull("OperationContext in not available.", context);
    assertNotNull("AutomationService in not available.", automationService);
  }

}
