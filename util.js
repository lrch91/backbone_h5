define([], function () {
    var util={};
    util.ip="http://172.24.104.35";
    util.url = {
        'EFinancema_form': '/api/EFinancema/zjhb/biaodan',
        'EFinancema_table': '/api/EFinancema/zjhb/biaoge',
    };
    for (var key in util.url){
        util.url[key] = util.ip + util.url[key];
        console.log(key+":"+util.url[key]);
    }  
    
    return util;
});