define([], function () {
    var util={};
    // util.ip="http://127.0.0.1/";
    //util.ip="http://192.168.191.1/";
    util.ip="http://localhost:63342/";
    // util.ip="http://172.24.104.35";
    util.ip = '';
    util.url = {
        'EFinancema_login': '/EIP_SSO/j_security_check',
        'EFinancema_form': '/EIP_MOA_Services/QueryProcDataForSimpleSrv.do?method=getQueryProcDataForSimple',
        'EFinancema_table': '/EIP_MOA_Services/QueryProcDataForSimpleTableSrv.do?method=getQueryProcDataForSimpleTable',
        'EFinancema_opinions': '/EIP_MOA_Services/QueryCommentSrv.do?method=getQueryComment',
        'EFinancema_queryTpl': '/EIP_MOA_Services/QueryTemplateRelaInfoSrv.do?method=getQueryTemplateRelaInfo',
    };
    for (var key in util.url){
        util.url[key] = util.ip + util.url[key];
        // console.log(key+":"+util.url[key]);
    }  
    

    return util;
});