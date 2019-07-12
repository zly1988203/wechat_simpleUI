<!--保险v2.0start-->
<div class="insurance-container">
    <div class="insurance-title">
        <div class="title">出行保障<span>（为自己和家人添一份安心）</span></div>
        <div class="amount" id="insurancePrice">0元</div>
    </div>
    <div id="wrapper">
        <div class="content">
            <ul>
                <#if insuranceRulePriceList?exists>
                    <#list insuranceRulePriceList as insuranceRule>
                        <li class="insurance-item" data-unit="${insuranceRule.insurancePrice!0}" data-type="${insuranceRule.insuranceType!0}" data-id="${insuranceRule.insuranceId!0}" data-defaultChoice="${insuranceRule.defaultChoice?string ("true","false")}">
                            <div class="desc">${insuranceRule.sumInsured/10000!0}万保障</div>
                            <div class="amount"><span class="unit-price">￥${insuranceRule.insurancePrice!0}</span> x <span class="count">份</span></div>
                            <div class="insuranceIntro" style="display: none">${insuranceRule.insuranceIntro!'暂无说明'}</div>
                            <div class="detail-btn"><span>详情</span></div>
                        </li>
                    </#list>
                </#if>
            </ul>
        </div>
    </div>
</div>
<!--备注-->
<div class="comment-container" id="commentBtn" style="display: none;">
    <div class="comment">备注</div>
    <div class="comment-text" id="commentText">选填</div>
</div>
<!--备注弹出框-->
<div id="popupCommentInfo" class="sui-popup-container comment-info-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <!--内容开始-->
        <div class="close"><img src="/res/images/newInnerCity/icon-left.png"/></div>
        <div class="commit">
            <label>
                <textarea id="remark" placeholder="${remark!'可填写备注，建议填写与我们沟通好的内容'}" maxlength="40"></textarea>
                <div class="message-length">0/40</div>
            </label>
        </div>
        <div class="btn-group">
            <div class="btn">确定</div>
        </div>
        <!--内容结束-->
    </div>
</div>
<!--保险详情弹出-->
<div class="popup-container" id="insuranceDetail" style="display: none">
    <div class="content">
        <div class="main-content">
            <div class="title sui-border-b">保险说明</div>
            <div class="main"></div>
        </div>
        <div class="close"></div>
    </div>
</div>
<!--保险v2.0end-->
