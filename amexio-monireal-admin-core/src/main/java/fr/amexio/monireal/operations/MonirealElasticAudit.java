package fr.amexio.monireal.operations;

import fr.amexio.monireal.constants.MonirealConstants;

import fr.amexio.monireal.utils.AuthAccessUtils;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.runtime.api.Framework;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Retrieve ElasticSearch audit.
 */
@Operation(id = MonirealElasticAudit.ID, category = MonirealConstants.MONIREAL, label = "ElasticSearch Audit", description = "Retrieve ElasticSearch de-sync audit.")
public class MonirealElasticAudit {
    /**
     * Request Identifier
     */
    public static final String ID = MonirealConstants.MONIREAL + ".getElasticAudit";

    protected static final String DEFAULT_CHECK_SEARCH_NXQL = "SELECT * FROM Document WHERE ecm:mixinType != 'HiddenInNavigation' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    /**
     * Extract result from ElasticSearch Audit
     *
     * @params ppName
     * @params nxql
     */
    protected Map<String, Serializable> extractResultInfo(String ppName, String nxql) {
        OperationContext ctx = new OperationContext(session);
        PageProviderService pageProviderService = Framework.getService(PageProviderService.class);
        PageProviderDefinition ppdef = pageProviderService.getPageProviderDefinition(ppName);
        HashMap<String, Serializable> params = new HashMap<>();

        params.put("coreSession", (Serializable) ctx.getCoreSession());

        PageProvider<?> pp = pageProviderService.getPageProvider(ppName, ppdef, null, null, 10L, 0L, params);
        String[] patternParams = {nxql};

        pp.setParameters(patternParams);
        pp.setPageSize(pp.getResultsCount());
        pp.setResultsCount(0L);

        long start = System.currentTimeMillis();
        List<DocumentModel> res = (List<DocumentModel>) pp.getCurrentPage();
        long duration = System.currentTimeMillis() - start;
        Map<String, Serializable> ret = new HashMap<>();

        // Insert to Json Object
        ret.put("pageProvider", ppName);
        ret.put("took", duration);
        ret.put("resultsCount", pp.getResultsCount());
        ret.put("resultsCountLimit", pp.getResultsCountLimit());
        ret.put("results", (Serializable) res.stream().map(DocumentModel::getId).collect(Collectors.toList()));
        return ret;
    }

    @OperationMethod
    public Blob run() {
        // Verify if the user has right access
        AuthAccessUtils.checkAccess(ctx);

        String nxql = DEFAULT_CHECK_SEARCH_NXQL;
        Map<String, Serializable> repoSearch = extractResultInfo("nxql_repo_search", nxql);
        Map<String, Serializable> elasticSearch = extractResultInfo("nxql_elastic_search", nxql);
        JSONObject result = new JSONObject();

        @SuppressWarnings("unchecked")
        List<String> repoResults = (List<String>) repoSearch.get("results");
        @SuppressWarnings("unchecked")
        List<String> elasticResults = (List<String>) elasticSearch.get("results");

        if (repoResults != null && elasticResults != null) {
            // Json data insertion
            result.put("query", nxql);
            result.put("repoSearch", repoSearch);
            result.put("elasticSearch", elasticSearch);
            return new JSONBlob(result.toString());
        } else {
            return null;
        }
    }
}
