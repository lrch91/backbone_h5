define([], function () {
    var util={};
    // util.ip="http://127.0.0.1/";
    util.ip="http://192.168.191.1/";
    // util.ip="http://172.24.104.35";
    util.url = {
        'EFinancema_login': '/EIP_SSO/j_security_check',
        'EFinancema_form': '/api/EFinancema/zjhb/biaodan',
        'EFinancema_table': '/api/EFinancema/zjhb/biaoge',
        'EFinancema_opinion': '/api/EFinancema/zjhb/opinion',
        'EFinancema_opinion2': '/api/EFinancema/zjhb/opinion2',
    };
    for (var key in util.url){
        util.url[key] = util.ip + util.url[key];
        console.log(key+":"+util.url[key]);
    }  
    
    return util;
});