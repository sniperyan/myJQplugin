(function ($) {
    // 添加遮罩层
    $.layOn = function (layId) {
        layId = layId || 'layOn' + new Date().getTime();
        var html = '<div id="' + layId + '"class="thick" style=""> </div>';
        return $(html).appendTo($("body")).show();
    };
    //去除遮罩
    $.layOff = function(layId){
        var selector = "div[class='thick']";
        layId && (selector += "[id='" + layId + "']");
        return $(selector).remove();
    }
    //支付框
    var defaultPaySettings = {
        title:'',
        money:'',
        userName:'',
        afterConfirm: null
    };
    $.payOn = function (option) {
        var settings = $.extend({}, defaultPaySettings, option || {});
        var payOnId= "payOn" + new Date().getTime();
        var layId = "layOn" + new Date().getTime();
        var confirmBtnId = "confirmBtn" + new Date().getTime();
        var html = ' <div id="'+payOnId+'" style="z-index: 1000;';
        html += 'display: none;position: fixed;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%);';
        html += '-ms-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">        <div style="width: 600px;height: 380px;text-align: center; -webkit-border-radius: 5px; -moz-border-radius: 5px;border-radius: 5px;padding-left: -15px;padding-right: -15px;background-color: #fff;">';
        html += '<p style="padding: 40px;background-color: #32A3E5"><span style="font-size: 30px;font-weight: bold">'+settings.title+'</span>&nbsp;&nbsp;<span style="color: #FE6500">'+settings.money+'</span>&nbsp;元</p>';
        html += '<p style="padding-top: 60px">账户名：<input type="text" value="'+settings.userName+'"></p>';
        html += '<p style="padding-top: 10px">密码：&nbsp;&nbsp;&nbsp;<input type="password"></p>';
        html += '<p style="margin-top: 20px"><input id="'+confirmBtnId+'" type="button" value="确认支付" style="background-color: #FE6500;color:#f7f7f7;border: none;margin-left:47px;width: 170px;height: 30px;';
        html +='-webkit-border-radius: 10px;-moz-border-radius: 10px;-ms-border-radius: 10px;border-radius: 10px;"></p></div></div>';

        $.layOn(layId);
        $(html).appendTo($("body")).show().find("#"+confirmBtnId).on("click", function () {
            $.layOff(layId);
            $("#"+payOnId).remove();
            settings.afterConfirm && settings.afterConfirm();
        })
    };

    //旋转加载
    $.loadOn = function (loadText, loadId, force) {
        var selector = "div[class='loadding']";
        var loadingGifUrl = basePath+"/images/loading.gif";
        if (!force && $(selector).length > 0) return;

        loadId = loadId || 'loadOn' + new Date().getTime();
        var html = '<div class="loadding" ';
        html += ' id="' + loadId + '" ';
        html += '><div class="load">';
        html += '<div id="circularG">';
        html += '<img src='+loadingGifUrl+' style="width:30px;height:30px;">';
        html += '</div>';
        html += '<div class="text">';
        html += (loadText || '正在加载');
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $.layOn(loadId);
        return $(html).appendTo($("body")).show();
    };
    $.loadOff = function (loadId) {
        var selector = "div[class='loadding']";
        loadId && (selector += "[id='" + loadId + "']");
        $.layOff(loadId);
        return $(selector).remove();
    };


    //ajax
    var send = function (url, data, beforeSend, complete, success, error, type, contentType) {
        return $.ajax({
            type: type || "POST",
            contentType: contentType || 'application/x-www-form-urlencoded;charset=UTF-8',
            url: url,
            data: data,
            error: error,
            beforeSend: beforeSend,
            complete: complete,
            success: success
        });
    };

    //旋转加载 ajax
    $.sendp = function (url, data, success, error, type) {
        return sendCirBase(url, data, success, error, type, true);
    };
    var sendCirBase = function (url, data, success, error, type, showModal, contentType) {
        var reqId = new Date().getTime();
        var timeoutId;
        return send(url, data, function () {
            showModal && (timeoutId = setTimeout(function () {
                $.loadOn(null, reqId);
            }, 500));
        }, function () {
            showModal && timeoutId && clearTimeout(timeoutId);
        }, function (data) {
            success && success(data);
            showModal && $.loadOff(reqId);
        }, function () {
            error && error();
            showModal && $.loadOff(reqId);
        }, type, contentType);
    };


    //带确定取消提示框
    var defaultConfirmCancelSettings = {
        id: null,
        tipText: "提示信息",
        confirmContent:"",
        confirmBtn: "确定",
        cancelBtn: "取消",
        confirm: null,
        cancel: null,
        afterConfirm: null,
        afterCancel: null
    };
    $.confirmCancelOn = function (option) {
        var settings = $.extend({}, defaultConfirmCancelSettings, option || {});
        var confirmId = settings.id || 'confirmOn' + new Date().getTime();
        var html = '<div class="tips tip-with-confirm-cancel" id="'+confirmId+'"><div class="tip">';
        html += '<div class="confirm_head">'+(settings.tipText || '提示信息')+'</div>';
        html += '<div class="confirm_content">'+(settings.confirmContent || '')+'</div>';
        html += '<div class="bottomBtn confirm">' + (settings.cancelBtn || "取消") +'</div>';
        html += '<div class=" bottomBtn cancel">'+ (settings.confirmBtn || "确定") +'</div>';

        $.layOn(confirmId);
        $(html).appendTo($("body")).show().find(".cancel").on("click", function () {
            var tp = $(this).parents(".tips");
            if (settings.confirm) return settings.confirm(function () {
                tp.remove();
                $.layOff(confirmId);
            });
            tp.remove();
            $.layOff(confirmId);
            settings.afterConfirm && settings.afterConfirm();
        }).end().find(".confirm").on("click", function () {
            var tp = $(this).parents(".tips");
            if (settings.cancel) return settings.cancel(function () {
                tp.remove();
                $.layOff(confirmId);
            });
            tp.remove();
            $.layOff(confirmId);
            settings.afterCancel && settings.afterCancel();
        });
    };

    $.confirmCancelOff = function (confirmId) {
        var selector = "div[class*='tip-with-confirm-cancel']";
        confirmId && (selector += "[id='" + confirmId + "']");
        $.layOff(confirmId);
        return $(selector).remove();
    };
    //只带确定提示框
    var defaultConfirmSettings = {
        id: null,
        tipText: "提示信息",
        confirmContent:"",
        confirmBtn: "确定",
        confirm: null,
        afterConfirm: null
    };
    $.confirmOn = function (option) {
        var settings = $.extend({}, defaultConfirmSettings, option || {});
        var confirmId = settings.id || 'confirmOn' + new Date().getTime();
        var html = '<div class="onlyConfirm tip-with-confirm" id="'+confirmId+'"><div class="tip">';
        html += '<div class="confirm_head">'+(settings.tipText || '提示信息')+'</div>';
        html += '<div class="confirm_content">'+(settings.confirmContent || '')+'</div>';
        html += '<div class="bottomBtn confirm">' + (settings.cancelBtn || "确定") +'</div>';

        $.layOn(confirmId);
        $(html).appendTo($("body")).show().find(".confirm").on("click", function () {
            var tp = $(this).parents(".onlyConfirm");
            if (settings.confirm) return settings.confirm(function () {
                tp.remove();
                $.layOff(confirmId);
            });
            tp.remove();
            $.layOff(confirmId);
            settings.afterConfirm && settings.afterConfirm();
        });
    };

    $.confirmOff = function (confirmId) {
        var selector = "div[class*='tip-with-confirm']";
        confirmId && (selector += "[id='" + confirmId + "']");
        $.layOff(confirmId);
        return $(selector).remove();
    };

    //统一跳转页面
    var successPageSettings = {
        action:"",
        title:"",
        successTitle:"",
        btnText1:"",
        btnText2:"",
        btnHref1:"",
        btnHref2:""
    };
    $.successPage = function(option){
        var settings = $.extend({}, successPageSettings, option || {});
        var formId = 'formId' + new Date().getTime();
        var html = '<form id="'+formId+'" action="'+settings.action+'" method="post">';
        html += '<input type="hidden" name="successPage.title" value="'+settings.title+'">';
        html += '<input type="hidden" name="successPage.successTitle" value="'+settings.successTitle+'">';
        html += '<input type="hidden" name="successPage.btnText1" value="'+settings.btnText1+'">';
        html += '<input type="hidden" name="successPage.btnText2" value="'+settings.btnText2+'">';
        html += '<input type="hidden" name="successPage.btnHref1" value="'+settings.btnHref1+'">';
        html += '<input type="hidden" name="successPage.btnHref2" value="'+settings.btnHref2+'">';
        html += '</form>';
        $(html).appendTo($("body")).submit();
    };
})(jQuery);