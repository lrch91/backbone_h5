define([], function () {
    var util={};
    // util.ip="http://127.0.0.1/";
    // util.ip="http://192.168.191.1/";
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
        //暂不能用 提交 procId userId comment nextUser nextStep nextStepName
        'EFinancema_submit': '/EIP_MOA_Services/SubmitProcDataSrv.do?method=getSubmitProcData',
        //附件下载 fileId system
        // 'EFinancema_attachDownload': '/EIP_MOA_Services/DownloadAttachmentsSrv.do?method=getDownloadAttachments',
        'EFinancema_attachDownload': '/EIP_MOA_Services/DownloadAttachSrv.do?method=getDownloadAttach',
        //常用审批意见查询接口 userId flowName
        'EFinancema_usualOpinionOptions': '/EIP_MOA_Services/QueryPresetAuditingCommentsSrv.do?method=getQueryPresetAuditingComments',
        // 暂未用 流程轨迹查询接口 userId procId 注意这里的procId是process_unify_XXX表的processId字段
        'EFinancema_queryTrailFlow': '/EIP_MOA_Services/QueryProcTracingSrv.do?method=getQueryProcTracing',
        
    };
    for (var key in util.url){
        util.url[key] = util.ip + util.url[key];
        // console.log(key+":"+util.url[key]);
    }

    util.hint = function(text){
        // var h = document.createElement("div");
        // h.className="hinter";
        // var ht = document.createElement("span");
        // ht.className="hinter_title";
        // var t=document.createTextNode(text);
        // ht.appendChild(t);
        // h.appendChild(ht);
        // h.style.opacity = 0.8;
        // var b = document.getElementsByTagName("body")[0];
        // b.appendChild(h);
        // setTimeout(function(){
        //     h.style.opacity = 0;
        //      h.parentNode.removeChild(h);
        // },2000);

        var nod = $('<div></div>').addClass('hinter').html('<span class="hinter_title">'+text+'</span>');
        $('body').append(nod);
        // var h = (parseFloat(nod.css("bottom")) -100)+"px";
        nod.animate({
            opacity: 0, 
            bottom: 0,
        }, 1500, 'ease-out', function(){
            nod.remove();
        });
    }

    util.confirmer = function(title,y_func,n_func){
        $(".confirmer_title").html(title);
        $(".confirmer_n").click(function(){
            if(n_func&&typeof(n_func)=="function"){
                n_func();
            }
            $(".confirmer").css("display", "none");
        })
        $(".confirmer_y").click(function(){
            if(y_func&&typeof(y_func)=="function"){
                y_func();
            }
            $(".confirmer").css("display", "none");
        });
        $(".confirmer").css("display", "block");
    }

    util.oprtLoader=function(flag){
        if(flag==0){
            $(".oprt_loader").css("display", "none");
        }else{
            $(".oprt_loader").css("display", "block");
        }
    }

    return util;
    
});