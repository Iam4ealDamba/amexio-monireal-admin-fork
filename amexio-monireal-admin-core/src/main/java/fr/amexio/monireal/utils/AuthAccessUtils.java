package fr.amexio.monireal.utils;

import org.jetbrains.annotations.NotNull;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * Authentication utils methods
 */
public class AuthAccessUtils {
  /**
   * Checks if the user has administrative access before executing a request.
   *
   * @param ctx The operation context containing user information.
   * @throws NuxeoException if the user does not have administrative rights.
   */
  public static void checkAccess(@NotNull OperationContext ctx) {
    // Obtain the principal (user) from the operation context
    NuxeoPrincipal principal = ctx.getPrincipal();

    // Check if the principal is null or not an administrator
    if (principal == null || !principal.isAdministrator()) {
      // Throw an exception if unauthorized access is detected
      throw new NuxeoException("Unauthorized access: " + principal);
    }
  }
}
