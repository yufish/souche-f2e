define(function() {

    var _id = {
        defaultSubmitBtn: 'span_submit',
        customSubmitBtn: 'span_submit_custom'
    };

    var defaultSubmitBtn, customSubmitBtn;

    var _data = {
        // 表单验证: 自定义时的表单验证
        validateCustomInputData: function() {
            var regx = new RegExp(/^[\d]+[.]*[\d]*$/);
            var repaymentMin = $("#repayment_min_input_custom").val();
            var downpaymentMax = $("#downpayment_max_input_custom").val();
            var downpaymentInput = $("#downpayment_input_custom").val();

            if (((!regx.test(repaymentMin) && repaymentMin != "") || (repaymentMin[0] == "." || repaymentMin[repaymentMin.length - 1] == ".") || (!regx.test(downpaymentMax) && downpaymentMax != "") || (downpaymentMax[0] == "." || downpaymentMax[downpaymentMax.length - 1] == ".") || (!regx.test(downpaymentInput) && downpaymentInput != "") || downpaymentInput[0] == "." || downpaymentInput[downpaymentInput.length - 1] == ".")) {
                $(".loan_waring").html("输入正确的数据格式");
                return false;
            }

            $(".loan_waring").html("");

            var repaymentMin = $("#repayment_min_input_custom").val();
            var downpaymentMax = $("#downpayment_max_input_custom").val();

            if (!!repaymentMin && !!downpaymentMax) {
                if (parseInt(downpaymentMax) < parseInt(repaymentMin)) {
                    $(".loan_waring").html("月还款数据输入有误");
                    return false;
                }
            } else if (!(!!repaymentMin || !!downpaymentMax)) {
                //$(".loan_waring").html("月还款数据输至少输出一个");
                //return false;
            }

            return true;
        },
        // 表单验证: 必须是数字
        validateInputData: function() {
            var regx = new RegExp(/^[\d]+[.]*[\d]*$/);
            var downpaymentInput = $("#downpayment_input").val();

            if ((!regx.test(downpaymentInput) && downpaymentInput != "") || downpaymentInput[0] == "." || downpaymentInput[downpaymentInput.length - 1] == ".") {
                $(".loan_waring").html("输入正确的数据格式");
                return false;
            }

            $(".loan_waring").html("");

            return true;
        }
    };

    var _event = {
        bind: function() {
            // "按贷款方式查询"部分的input监控 和 表单验证(是否将submit按钮的disable去掉)
            $(".loan input[type!='checkbox']").change(_event.checkDefaultForm);


            /* ------------- 默认表单 ------------- */
            // 监控"首付"的输入
            $("#downpayment_input").keyup(_event.checkDefaultForm);
            // 分期数 和 月付 的选项点击事件处理
            $("#downpayment_select .sc-select-list a,#repaymentvalue_select .sc-select-list a").click(function() {
                defaultSubmitBtn.removeClass("disableSubmit");
            });
            // 点选分期数
            $("#downpayment_select .sc-select-list a").click(function() {
                var value = $(this).attr("data-value");
                $("#downpayment_select_custom .sc-select-content").html(value);
                $("#downpayment_select_input_custom").val(value);
            });


            /* ------------- 自定义之后的表单 ------------- */
            // "自定义每月还款额"时 首付和月还款的监控
            $("#downpayment_input_custom,#repayment_min_input_custom,#downpayment_max_input_custom").keyup(_event.checkCustomForm);
            // 点选 "自定义每月还款额" handler
            $(".loan .sc-select-list a[data-value='自定义']").click(function() {
                $(".loan").addClass("hidden");
                $(".loan_custom").removeClass("hidden");
                $("#downpayment_input_custom").val($("#downpayment_input").val());
            });


            // 两个表单的提交事件处理
            defaultSubmitBtn.click(_event.defaultFormSubmit);
            customSubmitBtn.click(_event.customFormSubmit);
        },
        // 两个表单验证函数
        checkDefaultForm: function() {
            defaultSubmitBtn.removeClass("disableSubmit");
            _data.validateInputData(this);
        },
        checkCustomForm: function() {
            customSubmitBtn.removeClass("disableSubmit");
            _data.validateCustomInputData();
        },
        // 两个表单提交函数
        defaultFormSubmit: function() {
            //填充表单数据
            if (!_data.validateInputData(this)) {
                return false;
            }

            if ($(this).hasClass("disableSubmit")) {
                return false;
            }

            $(".custom-price #downpayment").val($(".loan #downpayment_input").val().replace(/[\s+]/g, ''));
            $(".custom-price #downpaymentSelect").val($(".loan #downpayment_select_input").val().replace(/[\s+]/g, ''));
            //  $(".custom-price #minRepayment").val($(".loan #repayment_min_input").val().replace(/[\s+]/g, ''));
            // $(".custom-price #maxRepayment").val($(".loan #downpayment_max_input").val().replace(/[\s+]/g, ''));

            $(".loan .custom-price #downpayment").val($(".loan #downpayment_input").val().replace(/[\s+]/g, ''));
            $(".loan .custom-price #downpaymentSelect").val($(".loan #downpayment_select_input").val().replace(/[\s+]/g, ''));
            //   $(".loan .custom-price #minRepayment").val($(".loan #repayment_min_input").val().replace(/[\s+]/g, ''));
            //   $(".loan .custom-price #maxRepayment").val($(".loan #downpayment_max_input").val().replace(/[\s+]/g, ''));
            if ($("#repaymentvalue_select_input").val() != "不限") {
                var result = $("#repaymentvalue_select_input").val().split('-');

                if (result.length == 2) {
                    var min = result[0];
                    var max = result[1];
                }
                if (result.length == 1) {
                    var max = result[0];
                    var min = "0";
                }

                $(".custom-price #minRepayment").val(min);
                $(".custom-price #maxRepayment").val(max);
                $(".loan .custom-price #minRepayment").val(min);
                $(".loan .custom-price #maxRepayment").val(max);
                $("#repaymentvalue_select_input_min").val(min);
                $("#repaymentvalue_select_input_max").val(max);
            }

            if ($("#downpayment_input").val().replace(/[\s+]/g, '') == "") {
                $(".loan_waring").html("请输入首付贷款数据");
                return;
            }

            if ($("#downpayment_select_input").val().replace(/[\s+]/g, '') == "") {
                $(".loan_waring").html("请输入首付贷款期数");
                return;
            }

            $(".loan .loadcustom").submit();
        },
        customFormSubmit: function() {
            //填充表单数据
            if (!_data.validateCustomInputData(this)) {
                return false;
            }

            $(".custom-price #downpayment").val($(".loan_custom #downpayment_input_custom").val().replace(/[\s+]/g, ''));
            $(".custom-price #downpaymentSelect").val($(".loan_custom #downpayment_select_input_custom").val().replace(/[\s+]/g, ''));
            $(".custom-price #minRepayment").val($(".loan_custom #repayment_min_input_custom").val().replace(/[\s+]/g, ''));
            $(".custom-price #maxRepayment").val($(".loan_custom #downpayment_max_input_custom").val().replace(/[\s+]/g, ''));

            $(".loan_custom .custom-price #downpayment").val($(".loan_custom #downpayment_input_custom").val().replace(/[\s+]/g, ''));
            $(".loan_custom .custom-price #downpaymentSelect").val($(".loan_custom #downpayment_select_input_custom").val().replace(/[\s+]/g, ''));
            $(".loan_custom .custom-price #minRepayment").val($(".loan_custom #repayment_min_input_custom").val().replace(/[\s+]/g, ''));
            $(".loan_custom .custom-price #maxRepayment").val($(".loan_custom #downpayment_max_input_custom").val().replace(/[\s+]/g, ''));

            if ($("#downpayment_input_custom").val().replace(/[\s+]/g, '') == "") {
                $(".loan_waring").html("请输入首付贷款数据");
                return;
            }

            if ($("#downpayment_select_input_custom").val().replace(/[\s+]/g, '') == "") {
                $(".loan_waring").html("请输入首付贷款期数");
                return;
            }

            $(".loan_custom .loadcustom").submit();
        }
    };

    function getEle() {
        defaultSubmitBtn = $('#' + _id.defaultSubmitBtn);
        customSubmitBtn = $('#' + _id.customSubmitBtn);
        // = $('#'+_id.);
        // = $('#'+_id.);
        // = $('#'+_id.);
        // = $('#'+_id.);
    }

    function init() {
        getEle();
        _event.bind();
    }

    return {
        init: init
    };
});