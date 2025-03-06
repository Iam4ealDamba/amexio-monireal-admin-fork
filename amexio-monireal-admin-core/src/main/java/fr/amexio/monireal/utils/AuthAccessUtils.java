package fr.amexio.monireal.utils;

import org.jetbrains.annotations.NotNull;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

public class AuthAccessUtils {
  public static void checkAccess(@NotNull OperationContext ctx) {
    NuxeoPrincipal principal = ctx.getPrincipal();
    if (principal == null || !principal.isAdministrator()) {
      throw new NuxeoException("Unauthorized access: " + principal);
    }
  }
}
