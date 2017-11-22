define([], function () {
    var util={};
    // util.ip="http://127.0.0.1/";
    util.ip="http://192.168.191.1/";
    // util.ip="http://localhost:63342/";
    // util.ip="http://172.24.104.35";
    util.ip = '';
    util.url = {
        //登录 j_username  j_password
        'EFinancema_login': '/EIP_SSO/j_security_check',
        //表单 procType procId userId system
        'EFinancema_form': '/EIP_MOA_Services/QueryProcDataForSimpleSrv.do?method=getQueryProcDataForSimple',
        //表格 procType procId userId system pageNum pageSize keyColmName
        'EFinancema_table': '/EIP_MOA_Services/QueryProcDataForSimpleTableSrv.do?method=getQueryProcDataForSimpleTable',
        //审批意见接口 userId system procId commentType  commentType  全部=00 领导=01
        'EFinancema_opinions': '/EIP_MOA_Services/QueryCommentSrv.do?method=getQueryComment',
        //路径1.查询路径 参数 procId userId system queryItem 其中queryItem为实体类 里面是 colmEnName（固定为NextStep） colmValue(空) reserve1(空)
        //   2.查询人   参数 procId userId system queryItem 其中queryItem为实体类 里面是 colmEnName（固定为NextStep） colmValue(里面为stepId，在查询路径json提供) reserve1(stepName,在查询路径json提供)
        'EFinancema_queryTpl': '/EIP_MOA_Services/QueryTemplateRelaInfoSrv.do?method=getQueryTemplateRelaInfo',
        //提交 procId userId comment nextUser nextStep nextStepName orgId
        'EFinancema_submit': '/EIP_MOA_Services/SubmitProcDataSrv.do?method=getSubmitProcData',
        //附件下载 fileId system
        'EFinancema_attachDownload': '/EIP_MOA_Services/DownloadAttachmentsSrv.do?method=getDownloadAttachments',
        //常用审批意见查询接口 userId flowName
        'EFinancema_usualOpinionOptions': '/EIP_MOA_Services/QueryPresetAuditingCommentsSrv.do?method=getQueryPresetAuditingComments',
        //流程轨迹查询接口 userId procId 注意这里的procId是process_unify_XXX表的processId字段
        'EFinancema_queryTrailFlow': '/EIP_MOA_Services/QueryProcTracingSrv.do?method=getQueryProcTracing',
        
    };
    for (var key in util.url){
        util.url[key] = util.ip + util.url[key];
        // console.log(key+":"+util.url[key]);
    }

    return util;
});